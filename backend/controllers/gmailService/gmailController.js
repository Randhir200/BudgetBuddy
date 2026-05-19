const { google } = require('googleapis');
const cron = require('node-cron');
const { classifyExpense } = require('../../Agent/transactionType');
const { getMessage, extractBody, getHeader, parseHdfcUpi } = require('../../utils/gmailHelpers');
const { protect } = require('../../middlewares/authMiddleware');
const { signAppToken, verifyAppToken } = require('../../utils/appToken');
const { encryptToken, decryptToken } = require('../../utils/tokenCrypto');
const Expense = require('../../models/expenseModel');
const GmailConnection = require('../../models/gmailConnectionModel');
const Income = require('../../models/incomeModel');
const User = require('../../models/userModel');

module.exports = function (app) {
    let isSyncRunning = false;
    const firstSyncLookbackDays = 90;
    const hdfcSendersQuery = '(from:hdfcbank.bank.in OR from:hdfcbank.com OR from:hdfcbank.net)';
    const hdfcTxnSearchQuery = '("UPI txn" OR "Account update")';
    const loginScopes = ['openid', 'email', 'profile'];
    const gmailScopes = ['openid', 'email', 'profile', 'https://www.googleapis.com/auth/gmail.readonly'];
    const allowedSubjects = [
        'UPI txn',
        'View: Account update for your HDFC Bank A/c'
    ];

    function getFrontendUrl(path = '') {
        return `${process.env.FRONTEND_URL || 'http://localhost:5173'}${path}`;
    }

    function createOAuthClient(redirectUri) {
        return new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            redirectUri || process.env.GOOGLE_REDIRECT_URI
        );
    }

    function getLoginRedirectUri() {
        return process.env.GOOGLE_LOGIN_REDIRECT_URI || process.env.GOOGLE_REDIRECT_URI;
    }

    function getGmailRedirectUri() {
        return process.env.GOOGLE_GMAIL_REDIRECT_URI || process.env.GOOGLE_REDIRECT_URI;
    }

    function isAllowedHdfcSubject(subject) {
        if (!subject || /pre-approved|offer|loan/i.test(subject)) return false;

        return allowedSubjects.some(allowedSubject => subject.includes(allowedSubject));
    }

    async function getGoogleProfile(auth, idToken) {
        if (idToken) {
            const ticket = await auth.verifyIdToken({
                idToken,
                audience: process.env.GOOGLE_CLIENT_ID
            });
            const payload = ticket.getPayload();
            return {
                googleId: payload.sub,
                email: payload.email,
                name: payload.name,
                picture: payload.picture
            };
        }

        const oauth2 = google.oauth2({ version: 'v2', auth });
        const profile = await oauth2.userinfo.get();
        return {
            googleId: profile.data.id,
            email: profile.data.email,
            name: profile.data.name,
            picture: profile.data.picture
        };
    }

    async function findOrCreateUser(profile) {
        return User.findOneAndUpdate(
            { googleId: profile.googleId },
            {
                $set: {
                    googleId: profile.googleId,
                    email: profile.email,
                    name: profile.name,
                    picture: profile.picture,
                    lastLoginAt: new Date()
                }
            },
            { upsert: true, new: true, runValidators: true }
        );
    }

    function issueAppToken(user) {
        return signAppToken({
            userId: String(user._id),
            email: user.email,
            name: user.name
        });
    }

    app.get('/auth/me', protect, async (req, res) => {
        res.json({
            status: 'success',
            data: {
                userId: req.user.id,
                email: req.user.email,
                name: req.user.name
            }
        });
    });

    app.get('/auth/google/login', (req, res) => {
        const auth = createOAuthClient(getLoginRedirectUri());
        const state = signAppToken({ purpose: 'google-login' }, 10 * 60);
        const url = auth.generateAuthUrl({
            access_type: 'online',
            scope: loginScopes,
            state
        });

        res.redirect(url);
    });

    app.get('/auth/google/login/callback', async (req, res) => {
        try {
            await handleGoogleLoginCallback(req, res, getLoginRedirectUri());
        } catch (err) {
            console.error('Google login failed:', err.message);
            if (res.headersSent) return;
            res.redirect(getFrontendUrl('/login?authError=google_login_failed'));
        }
    });

    async function handleGoogleLoginCallback(req, res, redirectUri) {
        const { code, state } = req.query;
        const statePayload = verifyAppToken(state);
        if (statePayload.purpose !== 'google-login') {
            return res.redirect(getFrontendUrl('/login?authError=invalid_state'));
        }

        const auth = createOAuthClient(redirectUri);
        const { tokens } = await auth.getToken(code);
        auth.setCredentials(tokens);

        const profile = await getGoogleProfile(auth, tokens.id_token);
        const user = await findOrCreateUser(profile);
        const appToken = issueAppToken(user);

        return res.redirect(getFrontendUrl(`/auth/callback?token=${encodeURIComponent(appToken)}`));
    }

    app.get('/auth/google/connect', protect, (req, res) => {
        const auth = createOAuthClient(getGmailRedirectUri());
        const state = signAppToken({
            purpose: 'gmail-connect',
            userId: req.user.id
        }, 10 * 60);
        const url = auth.generateAuthUrl({
            access_type: 'offline',
            prompt: 'consent',
            scope: gmailScopes,
            state
        });

        res.redirect(url);
    });

    app.get('/auth/google/connect/callback', async (req, res) => {
        try {
            await handleGmailConnectCallback(req, res, getGmailRedirectUri());
        } catch (err) {
            console.error('Gmail connect failed:', err.message);
            if (res.headersSent) return;
            res.redirect(getFrontendUrl('/?gmail=connect_failed'));
        }
    });

    async function handleGmailConnectCallback(req, res, redirectUri) {
        const { code, state } = req.query;
        const statePayload = verifyAppToken(state);
        if (statePayload.purpose !== 'gmail-connect' || !statePayload.userId) {
            return res.redirect(getFrontendUrl('/?gmail=invalid_state'));
        }

        const auth = createOAuthClient(redirectUri);
        const { tokens } = await auth.getToken(code);
        auth.setCredentials(tokens);

        const profile = await getGoogleProfile(auth, tokens.id_token);
        const existingConnection = await GmailConnection.findOne({ userId: statePayload.userId });
        const refreshToken = tokens.refresh_token
            ? encryptToken(tokens.refresh_token)
            : existingConnection?.refreshToken;

        await GmailConnection.findOneAndUpdate(
            { userId: statePayload.userId },
            {
                $set: {
                    userId: statePayload.userId,
                    googleEmail: profile.email,
                    accessToken: encryptToken(tokens.access_token),
                    refreshToken,
                    expiryDate: tokens.expiry_date,
                    scope: tokens.scope,
                    tokenType: tokens.token_type,
                    isActive: true,
                    lastError: ''
                },
                $setOnInsert: {
                    lastSyncedAtSeconds: Math.floor(Date.now() / 1000) - firstSyncLookbackDays * 24 * 60 * 60
                }
            },
            { upsert: true, new: true, runValidators: true }
        );

        return res.redirect(getFrontendUrl('/?gmail=connected'));
    }

    app.get('/auth/google/callback', async (req, res) => {
        try {
            const statePayload = verifyAppToken(req.query.state);
            const legacyRedirectUri = process.env.GOOGLE_REDIRECT_URI || getLoginRedirectUri();

            if (statePayload.purpose === 'google-login') {
                return handleGoogleLoginCallback(req, res, legacyRedirectUri);
            }

            if (statePayload.purpose === 'gmail-connect') {
                return handleGmailConnectCallback(req, res, legacyRedirectUri);
            }

            return res.redirect(getFrontendUrl('/login?authError=invalid_state'));
        } catch (err) {
            console.error('Google legacy callback failed:', err.message);
            if (res.headersSent) return;
            return res.redirect(getFrontendUrl('/login?authError=google_callback_failed'));
        }
    });

    app.get('/gmail/status', protect, async (req, res) => {
        const connection = await GmailConnection.findOne({ userId: req.user.id });
        res.json({
            status: 'success',
            data: {
                connected: Boolean(connection?.isActive && connection?.refreshToken),
                googleEmail: connection?.googleEmail || null,
                lastSyncedAtSeconds: connection?.lastSyncedAtSeconds || null,
                lastError: connection?.lastError || null
            }
        });
    });

    app.get('/gmail', protect, async (req, res) => {
        try {
            const connection = await GmailConnection.findOne({ userId: req.user.id, isActive: true });
            if (!connection?.refreshToken) {
                return res.status(401).json({ error: 'Gmail not connected' });
            }

            const auth = createOAuthClient(getGmailRedirectUri());
            auth.setCredentials({
                access_token: decryptToken(connection.accessToken),
                refresh_token: decryptToken(connection.refreshToken),
                expiry_date: connection.expiryDate
            });

            const gmail = google.gmail({ version: 'v1', auth });
            const query = `${hdfcSendersQuery} ${hdfcTxnSearchQuery}`;
            const listRes = await gmail.users.messages.list({
                userId: 'me',
                q: query,
                maxResults: 5
            });

            const transactions = [];

            for (const m of listRes.data.messages || []) {
                const msg = await getMessage(gmail, m.id);
                const subject = getHeader(msg.payload.headers, 'Subject');
                if (!isAllowedHdfcSubject(subject)) continue;

                const body = extractBody(msg.payload);
                const txn = parseHdfcUpi(body);

                transactions.push(txn && txn.amount
                    ? { messageId: m.id, ...txn }
                    : { messageId: m.id, body });
            }

            res.json(transactions);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        }
    });

    async function listGmailMessages(gmail, query, maxResults = 500) {
        const messages = [];
        let pageToken;

        do {
            const listRes = await gmail.users.messages.list({
                userId: 'me',
                q: query,
                maxResults,
                pageToken
            });

            messages.push(...(listRes.data.messages || []));
            pageToken = listRes.data.nextPageToken;
        } while (pageToken);

        return messages;
    }

    function getGmailMessageDate(msg, payload) {
        if (msg.data?.internalDate) {
            const internalDate = new Date(Number(msg.data.internalDate));
            if (!Number.isNaN(internalDate.getTime())) return internalDate;
        }

        const dateHeader = getHeader(payload?.headers || [], 'Date');
        if (dateHeader) {
            const headerDate = new Date(dateHeader);
            if (!Number.isNaN(headerDate.getTime())) return headerDate;
        }

        return null;
    }

    function parseTxnDateTime(date, time, fallbackDate = null) {
        if (!date) return fallbackDate || new Date();

        const [day, month, year] = date.split('-');
        const fullYear = year.length === 2 ? `20${year}` : year;
        if (!time && fallbackDate) return fallbackDate;
        if (!time) return new Date(`${fullYear}-${month}-${day}T00:00:00+05:30`);

        let hours = '00';
        let minutes = '00';
        let seconds = '00';
        const timeMatch = time.match(/^(\d{1,2})[:.](\d{2})(?::(\d{2}))?\s*(AM|PM)?$/i);
        if (!timeMatch) return fallbackDate || new Date(`${fullYear}-${month}-${day}T00:00:00+05:30`);

        let parsedHours = Number(timeMatch[1]);
        const meridiem = timeMatch[4]?.toUpperCase();

        if (meridiem === 'PM' && parsedHours < 12) parsedHours += 12;
        if (meridiem === 'AM' && parsedHours === 12) parsedHours = 0;

        hours = String(parsedHours).padStart(2, '0');
        minutes = timeMatch[2];
        seconds = timeMatch[3] || '00';

        return new Date(`${fullYear}-${month}-${day}T${hours}:${minutes}:${seconds}+05:30`);
    }

    async function syncGmailConnection(connection) {
        if (!connection?.refreshToken) {
            return { saved: 0, skipped: 0 };
        }

        const auth = createOAuthClient(getGmailRedirectUri());
        auth.setCredentials({
            access_token: decryptToken(connection.accessToken),
            refresh_token: decryptToken(connection.refreshToken),
            expiry_date: connection.expiryDate
        });

        const gmail = google.gmail({ version: 'v1', auth });
        const after = (connection.lastSyncedAtSeconds
            || Math.floor(Date.now() / 1000) - firstSyncLookbackDays * 24 * 60 * 60) - 10;
        const query =
            `${hdfcSendersQuery} ` +
            `${hdfcTxnSearchQuery} ` +
            `after:${after}`;

        const messages = await listGmailMessages(gmail, query);
        let saved = 0;
        let skipped = 0;

        for (const m of messages) {
            let msg;
            try {
                msg = await gmail.users.messages.get({
                    userId: 'me',
                    id: m.id,
                    format: 'full'
                });
            } catch (err) {
                console.error('Failed to fetch Gmail message:', m.id, err.message);
                skipped += 1;
                continue;
            }

            const payload = msg.data?.payload;
            if (!payload) {
                skipped += 1;
                continue;
            }

            const subject = getHeader(payload.headers || [], 'Subject');
            if (!isAllowedHdfcSubject(subject)) {
                skipped += 1;
                continue;
            }

            const body = extractBody(payload);
            if (!body || !/HDFC/i.test(body) || !/UPI/i.test(body)) {
                skipped += 1;
                continue;
            }

            const txn = parseHdfcUpi(body);
            if (!txn || !txn.amount) {
                skipped += 1;
                continue;
            }

            const gmailMessageDate = getGmailMessageDate(msg, payload);
            const transactionDate = parseTxnDateTime(txn.date, txn.time, gmailMessageDate);

            if (txn.type === 'Credit') {
                const income = {
                    type: 'Income',
                    category: 'Uncategorised',
                    amount: txn.amount,
                    description: txn.merchant || txn.vpa || 'UPI credit',
                    dateRecieved: transactionDate,
                    userId: connection.userId,
                    source: 'Gmail',
                    merchant: txn.merchant || 'unknown',
                    vpa: txn.vpa || 'unknown',
                    gmailMessageId: m.id,
                    transactionReferenceId: txn.referenceId,
                    bank: txn.bank,
                    accountLast4: txn.accountLast4,
                    currency: txn.currency
                };

                try {
                    const alreadyExists = await Income.exists({
                        userId: income.userId,
                        gmailMessageId: income.gmailMessageId
                    });
                    if (alreadyExists) {
                        skipped += 1;
                        continue;
                    }

                    await Income.create(income);
                    saved += 1;
                } catch (err) {
                    if (err.code === 11000) {
                        skipped += 1;
                        continue;
                    }
                    console.error('Error saving Gmail income:', err.message);
                    skipped += 1;
                }
                continue;
            }

            const classification = await classifyExpense(txn, connection.userId);
            const expense = {
                type: classification.type,
                category: classification.category || 'others',
                price: txn.amount,
                merchant: txn.merchant || 'unknown',
                vpa: txn.vpa || 'unknown',
                item: classification.category || 'others',
                userId: connection.userId,
                confidence: classification.confidence,
                classificationSource: classification.source,
                classificationRuleId: classification.ruleId ? String(classification.ruleId) : undefined,
                source: 'Gmail',
                gmailMessageId: m.id,
                transactionReferenceId: txn.referenceId,
                bank: txn.bank,
                accountLast4: txn.accountLast4,
                currency: txn.currency,
                createdAt: transactionDate
            };

            if (expense.type === 'Ignore') {
                skipped += 1;
                continue;
            }

            try {
                const alreadyExists = await Expense.exists({
                    userId: expense.userId,
                    gmailMessageId: expense.gmailMessageId
                });
                if (alreadyExists) {
                    skipped += 1;
                    continue;
                }

                await Expense.create(expense);
                saved += 1;
            } catch (err) {
                if (err.code === 11000) {
                    skipped += 1;
                    continue;
                }
                console.error('Error saving Gmail expense:', err.message);
                skipped += 1;
            }
        }

        const credentials = auth.credentials || {};
        await GmailConnection.updateOne(
            { _id: connection._id },
            {
                $set: {
                    accessToken: credentials.access_token ? encryptToken(credentials.access_token) : connection.accessToken,
                    expiryDate: credentials.expiry_date || connection.expiryDate,
                    lastSyncedAtSeconds: Math.floor(Date.now() / 1000),
                    lastError: '',
                    isActive: true
                }
            }
        );

        return { saved, skipped };
    }

    async function syncAllGmailConnections() {
        const connections = await GmailConnection.find({ isActive: true, refreshToken: { $exists: true, $ne: '' } });
        for (const connection of connections) {
            try {
                const result = await syncGmailConnection(connection);
                console.log('Gmail sync done:', connection.userId, result);
            } catch (err) {
                console.error('Gmail sync failed:', connection.userId, err.message);
                await GmailConnection.updateOne(
                    { _id: connection._id },
                    { $set: { lastError: err.message, isActive: /invalid_grant/i.test(err.message) ? false : connection.isActive } }
                );
            }
        }
    }

  cron.schedule('0 22 * * *', async () => {
        if (isSyncRunning) {
            console.log('Gmail sync already running, skipping this tick');
            return;
        }

        try {
            isSyncRunning = true;
            await syncAllGmailConnections();
        } catch (e) {
            console.error('Gmail sync failed:', e.message);
        } finally {
            isSyncRunning = false;
        }
    });

    app.get('/gmail/sync-now', protect, async (req, res) => {
        const connection = await GmailConnection.findOne({ userId: req.user.id, isActive: true });
        if (!connection?.refreshToken) {
            return res.status(401).json({ error: 'Gmail not connected' });
        }

        const result = await syncGmailConnection(connection);
        res.json({ status: 'Synced', ...result });
    });
};

const { google } = require('googleapis');
const cron = require('node-cron');
const { classifyExpense } = require('../../Agent/transactionType');
const { getMessage, extractBody, getHeader, parseHdfcUpi } = require('../../utils/gmailHelpers');
const Expense = require('../../models/expenseModel');
// use app instance passed from index.js
module.exports = function (app) {
    let savedTokens = null;
    let lastSyncedAtSeconds = null;
    let isSyncRunning = false;
    const defaultUserId = '6638bbb72ee0057ac3f3e21a'; // TEMP FIX, replace with actual logged-in userId
    const firstSyncLookbackDays = 60;
    const hdfcSendersQuery = '(from:hdfcbank.bank.in OR from:hdfcbank.com OR from:hdfcbank.net)';
    const hdfcTxnSearchQuery = '("UPI txn" OR "Account update")';
    const allowedSubjects = [
        'UPI txn',
        'View: Account update for your HDFC Bank A/c'
    ];

    function isAllowedHdfcSubject(subject) {
        if (!subject || /pre-approved|offer|loan/i.test(subject)) return false;

        return allowedSubjects.some(allowedSubject => subject.includes(allowedSubject));
    }

    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
    );

    app.get('/auth/google', (req, res) => {
        const url = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            prompt: 'consent',
            scope: ['https://www.googleapis.com/auth/gmail.readonly']
        });

        res.redirect(url);
    });


    /**
     * STEP 2: Google redirects back here
     */
    app.get('/auth/google/callback', async (req, res) => {
        try {
            const { code } = req.query;

            const { tokens } = await oauth2Client.getToken(code);

            // SAVE tokens (TEMP)
            savedTokens = tokens;
            // lastSyncedAtSeconds = Math.floor(Date.now() / 1000);

            res.send('Gmail connected successfully ✅');
        } catch (err) {
            console.error(err);
            res.status(500).send('OAuth failed ❌');
        }
    });


    /**
     * STEP 3: Fetch latest Gmail transactions
     */
    app.get('/gmail', async (req, res) => {
        try {
            if (!savedTokens) {
                return res.status(401).json({ error: 'Gmail not connected' });
            }

            oauth2Client.setCredentials({
                access_token: savedTokens.access_token,
                refresh_token: savedTokens.refresh_token
            });

            const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

            const query = `${hdfcSendersQuery} ${hdfcTxnSearchQuery}`;


            const listRes = await gmail.users.messages.list({
                userId: 'me',
                q: query,
                maxResults: 5
            });


            const transactions = [];

            for (const m of listRes.data.messages || []) {
                // 👇 HERE getMessage is used
                const msg = await getMessage(gmail, m.id);
                // console.log('msg:', msg);
                // `gmail.users.messages.get` returns an object with `data.payload`
                const subject = getHeader(msg.payload.headers, 'Subject');
                if (!isAllowedHdfcSubject(subject)) continue;

                const body = extractBody(msg.payload);
                const txn = parseHdfcUpi(body);

                if (txn && txn.amount) {
                    transactions.push({
                        messageId: m.id,
                        ...txn
                    });
                } else {
                    transactions.push({
                        messageId: m.id,
                        body
                    });
                }
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

    function parseTxnDate(date) {
        if (!date) return new Date();

        const [day, month, year] = date.split('-');
        const fullYear = year.length === 2 ? `20${year}` : year;

        return new Date(`${fullYear}-${month}-${day}`);
    }

    async function syncGmailTransactions(syncAfterSeconds) {
        if (!savedTokens) {
            console.log('Gmail not connected, skipping sync');
            return;
        }

        oauth2Client.setCredentials({
            access_token: savedTokens.access_token,
            refresh_token: savedTokens.refresh_token
        });

        const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
        console.log('Starting Gmail transaction sync...');
        let after = syncAfterSeconds
            ? syncAfterSeconds - 10 // 10 sec buffer
            : null;

        console.log(
            'Fetching emails after:',
            after ? new Date(after * 1000).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : 'beginning',
            '| Gmail after timestamp:',
            after
        );
        // for now remove after to fetch all emails corrct this later
        const query =
            `${hdfcSendersQuery} ` +
            `${hdfcTxnSearchQuery} ` +
            (after ? `after:${after}` : '');

        const messages = await listGmailMessages(gmail, query);
        console.log('Gmail sync - Emails fetched:', messages.length);
        if (!messages.length) {
            lastSyncedAtSeconds = Math.floor(Date.now() / 1000);
            return;
        }

        for (const m of messages) {
            console.log('Fetching Gmail message:', m.id);

            let msg;
            try {
                msg = await gmail.users.messages.get({
                    userId: 'me',
                    id: m.id,
                    format: 'full'
                });
            } catch (err) {
                console.error('Failed to fetch Gmail message:', m.id, err.message);
                continue;
            }

            console.log('Fetched Gmail message:', m.id);
            // `gmail.users.messages.get` returns an object with `data.payload`
            const payload = msg.data?.payload;
            if (!payload) {
                console.log('Skipping email without payload:', m.id);
                continue;
            }

            const subject = getHeader(payload.headers || [], 'Subject');
            console.log('Gmail message subject:', subject);
            if (!isAllowedHdfcSubject(subject)) {
                console.log('Skipping email because subject is not allowed:', m.id);
                continue;
            }

            const body = extractBody(payload);
            console.log('Gmail message body length:', body.length);
            console.log('Body preview:', body.substring(0, 100));

            if (!body) {
                console.log('Skipping email because body is empty:', m.id);
                continue;
            }

            if (!/HDFC/i.test(body) || !/UPI/i.test(body)) {
                console.log('Skipping email because body does not contain both HDFC and UPI:', m.id);
                continue;
            }

            const txn = parseHdfcUpi(body);
            if (!txn || !txn.amount) {
                console.log('Skipping email because transaction could not be parsed:', m.id, txn);
                continue;
            }

            const classification = await classifyExpense(txn, defaultUserId);
            console.log('💰 TRANSACTION:', txn);
            console.log('🤖 CLASSIFIED AS:', classification);
            console.log("txn", txn);
            // 👉 FINAL object to save in DB
            const expense = {
                type: classification.type, // Needs / Wants / Savings / Ignore
                category: classification.category || "others",
                price: txn.amount,
                merchant: txn.merchant || 'unknown',
                vpa: txn.vpa || 'unknown',
                item: classification.category || 'others',
                userId: defaultUserId,
                confidence: classification.confidence,
                source: 'Gmail',
                gmailMessageId: m.id,
                transactionReferenceId: txn.referenceId,
                bank: txn.bank,
                accountLast4: txn.accountLast4,
                currency: txn.currency,
                createdAt: parseTxnDate(txn.date)
            };
            // console.log('FINAL EXPENSE OBJECT:', expense);
            console.log('Saving expense to DB...', expense);
            // ❌ Skip ignored txns
            if (expense.type === 'Ignore') {
                console.log('Skipping ignored transaction:', m.id);
                continue;
            }

            try {
                const saveResult = await Expense.updateOne(
                    { userId: expense.userId, gmailMessageId: expense.gmailMessageId },
                    { $setOnInsert: expense },
                    { upsert: true }
                );

                console.log('Expense save result:', {
                    matchedCount: saveResult.matchedCount,
                    modifiedCount: saveResult.modifiedCount,
                    upsertedCount: saveResult.upsertedCount,
                    upsertedId: saveResult.upsertedId
                });
            } catch (err) {
                console.error('Error saving expense:', err.message);
            }
        }

        lastSyncedAtSeconds = Math.floor(Date.now() / 1000);
    }
    //@explain this
    cron.schedule('*/2 * * * *', async () => {
        if (isSyncRunning) {
            console.log('Gmail sync already running, skipping this tick');
            return;
        }

        if (!lastSyncedAtSeconds) {
            lastSyncedAtSeconds = Math.floor(Date.now() / 1000) - firstSyncLookbackDays * 48 * 60 * 60;
        }

        console.log('🔄 Gmail sync started (2 min)');
        try {
            isSyncRunning = true;
            await syncGmailTransactions(lastSyncedAtSeconds);
            console.log('✅ Gmail sync done');
        } catch (e) {
            console.error('❌ Sync failed', e.message);
        } finally {
            isSyncRunning = false;
        }
    });

    app.get('/gmail/sync-now', async (req, res) => {
        await syncGmailTransactions(lastSyncedAtSeconds || Math.floor(Date.now() / 1000) - firstSyncLookbackDays * 24 * 60 * 60);
        res.json({ status: 'Synced' });
    });

};

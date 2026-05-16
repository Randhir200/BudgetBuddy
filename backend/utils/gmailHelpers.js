async function getMessage(gmail, messageId) {
        const msg = await gmail.users.messages.get({
            userId: 'me',
            id: messageId,
            format: 'full'
        });
        return msg.data;
    }

function extractBody(payload) {
        // Helper to decode base64 and base64url safely
        function decodeBase64Url(b64) {
            if (!b64) return '';
            // Convert base64url -> base64
            const s = b64.replace(/-/g, '+').replace(/_/g, '/');
            // Pad with = to make length multiple of 4
            const pad = s.length % 4;
            const padded = pad ? s + '='.repeat(4 - pad) : s;
            return Buffer.from(padded, 'base64').toString('utf-8');
        }

        // prefer top-level body if available
        if (payload?.body?.data) {
            return decodeBase64Url(payload.body.data).trim();
        }

        // look for preferred parts: text/plain first, then text/html
        if (Array.isArray(payload?.parts)) {
            // try text/plain first
            for (const part of payload.parts) {
                if (part.mimeType === 'text/plain' && part.body?.data) {
                    return decodeBase64Url(part.body.data).trim();
                }
            }
            // fallback to html
            for (const part of payload.parts) {
                if (part.mimeType === 'text/html' && part.body?.data) {
                    return decodeBase64Url(part.body.data).trim();
                }
            }
        }

        return '';
    }



function hasHtml(text) {
        return /<\/?[a-z][\s\S]*>/i.test(text);
    }

function cleanHtml(html) {
        return html
            .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
            .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
            .replace(/<\/?[^>]+>/gi, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

function getHeader(headers, name) {
        return headers.find(h => h.name.toLowerCase() === name.toLowerCase())?.value;
    }


function parseHdfcUpi(text) {
        if (!text || typeof text !== 'string') return null;

        // Normalize whitespace
        const t = text.replace(/\r?\n/g, ' ').replace(/\s+/g, ' ').trim(); // single line

        const amountMatch = t.match(/Rs\.?\s?([\d,]+(?:\.\d{1,2})?)/i); // Rs. 1,234.56
        const amountStr = amountMatch ? amountMatch[1].replace(/,/g, '') : null; // remove commas
        const amount = amountStr ? Number(amountStr) : null; // convert to number

        const type = /\bdebit(?:ed)?\b/i.test(t) ? 'Debit' : /\bcredit(?:ed)?\b/i.test(t) ? 'Credit' : null; // determine transaction type

        const accountMatch = t.match(/account(?:\s+ending)?\s+(\d{2,4})/i); // last 2-4 digits of account
        const accountLast4 = accountMatch ? accountMatch[1] : null; // last 2-4 digits

        const upiDetailsMatch = t.match(/\b(?:to|towards)\s+VPA\s+([A-Za-z0-9._-]+@[A-Za-z0-9._-]+)(?:\s+\(([^)]*?)\)|\s+(.+?))?\s+on\s+(\d{2}-\d{2}-\d{2,4})\b/i);
        const vpaMatch = upiDetailsMatch || t.match(/\b(?:to|towards)\s+VPA\s+([A-Za-z0-9._-]+@[A-Za-z0-9._-]+)/i); // VPA pattern
        const vpa = vpaMatch ? vpaMatch[1] : null; // extract VPA

        // merchant: text between the VPA (or 'to') and the 'on <date>' token
        let merchant = null;
        const onDateMatch = t.match(/on\s+(\d{2}-\d{2}-\d{2,4})/i);
        const onDate = upiDetailsMatch ? upiDetailsMatch[4] : onDateMatch ? onDateMatch[1] : null;
        const cleanMerchantName = (name) => {
            if (!name) return null;

            const bracketMatch = name.match(/^\(([^)]*?)\)$/);
            return (bracketMatch ? bracketMatch[1] : name)
                .replace(/^[:,-\s]+|[,:\s]+$/g, '')
                .trim() || null;
        };

        if (upiDetailsMatch) {
            merchant = cleanMerchantName(upiDetailsMatch[2] || upiDetailsMatch[3]);
        }

        if (vpa && onDate) {
            const between = t.split(vpa)[1] || '';
            const beforeOn = between.split(/\s+on\s+/i)[0].trim();
            merchant = merchant || cleanMerchantName(beforeOn);
        } else if (vpa) {
            // fallback: take few words after vpa
            const after = t.split(vpa)[1] || '';
            merchant = after.split(' ')[1] ? cleanMerchantName(after.split(' ').slice(1, 6).join(' ').trim()) : null;
        }

        const refMatch = t.match(/reference(?:\s+(?:number|no\.?))?(?:\s+is)?\s*[:#]?\s*(?:number\s*)?(\d{6,})/i) || t.match(/ref(?:erence)?\s*[:#]?\s*(\d{6,})/i);
        const referenceId = refMatch ? refMatch[1] : null;

        const cleanText = hasHtml(t) ? cleanHtml(t) : t;

        return {
            bank: 'HDFC',
            type,
            amount,
            currency: amount ? 'INR' : null,
            accountLast4,
            vpa,
            merchant,
            referenceId,
            date: onDate,
            text: cleanText,
        };
    }

module.exports = {
    getMessage,
    extractBody,
    hasHtml,
    cleanHtml,
    getHeader,
    parseHdfcUpi,
};

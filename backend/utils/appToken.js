const crypto = require('crypto');

const defaultTokenTtlSeconds = 7 * 24 * 60 * 60;

function base64UrlEncode(value) {
    return Buffer.from(JSON.stringify(value))
        .toString('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}

function base64UrlDecode(value) {
    const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
    return JSON.parse(Buffer.from(padded, 'base64').toString('utf8'));
}

function getSecret() {
    const secret = process.env.APP_JWT_SECRET || process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('APP_JWT_SECRET or JWT_SECRET is required');
    }
    return secret;
}

function signAppToken(payload, ttlSeconds = defaultTokenTtlSeconds) {
    const now = Math.floor(Date.now() / 1000);
    const header = { alg: 'HS256', typ: 'JWT' };
    const body = {
        ...payload,
        iat: now,
        exp: now + ttlSeconds
    };

    const encodedHeader = base64UrlEncode(header);
    const encodedBody = base64UrlEncode(body);
    const signature = crypto
        .createHmac('sha256', getSecret())
        .update(`${encodedHeader}.${encodedBody}`)
        .digest('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');

    return `${encodedHeader}.${encodedBody}.${signature}`;
}

function verifyAppToken(token) {
    if (!token || typeof token !== 'string') {
        throw new Error('Token is required');
    }

    const [encodedHeader, encodedBody, signature] = token.split('.');
    if (!encodedHeader || !encodedBody || !signature) {
        throw new Error('Invalid token format');
    }

    const expectedSignature = crypto
        .createHmac('sha256', getSecret())
        .update(`${encodedHeader}.${encodedBody}`)
        .digest('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');

    const signatureBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);
    if (
        signatureBuffer.length !== expectedBuffer.length ||
        !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
    ) {
        throw new Error('Invalid token signature');
    }

    const payload = base64UrlDecode(encodedBody);
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        throw new Error('Token expired');
    }

    return payload;
}

module.exports = {
    signAppToken,
    verifyAppToken
};

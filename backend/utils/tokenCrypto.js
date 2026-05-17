const crypto = require('crypto');

function getEncryptionKey() {
    const secret = process.env.TOKEN_ENCRYPTION_SECRET || process.env.APP_JWT_SECRET || process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('TOKEN_ENCRYPTION_SECRET or APP_JWT_SECRET is required');
    }

    return crypto.createHash('sha256').update(secret).digest();
}

function encryptToken(value) {
    if (!value) return value;

    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', getEncryptionKey(), iv);
    const encrypted = Buffer.concat([
        cipher.update(String(value), 'utf8'),
        cipher.final()
    ]);
    const tag = cipher.getAuthTag();

    return [
        'enc',
        iv.toString('base64url'),
        tag.toString('base64url'),
        encrypted.toString('base64url')
    ].join('.');
}

function decryptToken(value) {
    if (!value || !String(value).startsWith('enc.')) return value;

    const [, iv, tag, encrypted] = String(value).split('.');
    const decipher = crypto.createDecipheriv(
        'aes-256-gcm',
        getEncryptionKey(),
        Buffer.from(iv, 'base64url')
    );
    decipher.setAuthTag(Buffer.from(tag, 'base64url'));

    return Buffer.concat([
        decipher.update(Buffer.from(encrypted, 'base64url')),
        decipher.final()
    ]).toString('utf8');
}

module.exports = {
    encryptToken,
    decryptToken
};

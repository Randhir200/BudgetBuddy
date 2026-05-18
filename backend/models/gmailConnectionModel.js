const mongoose = require('mongoose');

const gmailConnectionSchema = new mongoose.Schema({
    userId: { type: String, required: true, index: true, unique: true },
    googleEmail: { type: String, required: true, lowercase: true, trim: true },
    accessToken: { type: String, required: false },
    refreshToken: { type: String, required: false },
    expiryDate: { type: Number, required: false },
    scope: { type: String, required: false },
    tokenType: { type: String, required: false },
    lastSyncedAtSeconds: { type: Number, required: false },
    isActive: { type: Boolean, default: true },
    lastError: { type: String, required: false }
}, { timestamps: true });

const GmailConnection = mongoose.model('GmailConnection', gmailConnectionSchema, 'GmailConnection');

module.exports = GmailConnection;

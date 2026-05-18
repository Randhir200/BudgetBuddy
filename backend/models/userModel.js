const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    googleId: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    name: { type: String, required: false },
    picture: { type: String, required: false },
    authProvider: { type: String, default: 'google' },
    lastLoginAt: { type: Date, default: Date.now }
}, { timestamps: true });

const User = mongoose.model('User', userSchema, 'User');

module.exports = User;

const mongoose = require('mongoose');

function normalizeRuleValue(value) {
    return String(value || '')
        .trim()
        .replace(/\s+/g, ' ')
        .toLowerCase();
}

const merchantRuleSchema = new mongoose.Schema({
    userId: { type: String, required: true, index: true },
    matchType: {
        type: String,
        enum: ['vpa', 'merchant', 'pattern'],
        required: true
    },
    value: { type: String, required: true },
    normalizedValue: { type: String, required: true },
    type: {
        type: String,
        enum: ['Needs', 'Wants', 'Savings', 'Ignore'],
        required: true
    },
    category: { type: String, required: true },
    confidence: { type: Number, default: 0.95 },
    source: {
        type: String,
        enum: ['user', 'ai', 'seeded'],
        default: 'user'
    },
    confirmed: { type: Boolean, default: false },
    useCount: { type: Number, default: 0 }
}, { timestamps: true });

merchantRuleSchema.index(
    { userId: 1, matchType: 1, normalizedValue: 1 },
    { unique: true }
);

merchantRuleSchema.pre('validate', function setNormalizedValue(next) {
    this.normalizedValue = normalizeRuleValue(this.value);
    next();
});

merchantRuleSchema.statics.normalizeValue = normalizeRuleValue;

const MerchantRule = mongoose.model('MerchantRule', merchantRuleSchema, 'MerchantRule');

module.exports = MerchantRule;

require('dotenv').config();

const mongoose = require('mongoose');
const dbConfig = require('../configs/dbConfig');
const MerchantRule = require('../models/merchantRuleModel');

const globalRules = [
    { matchType: 'pattern', value: 'blinkit', type: 'Needs', category: 'grocery', confidence: 0.94 },
    { matchType: 'pattern', value: 'zepto', type: 'Needs', category: 'grocery', confidence: 0.94 },
    { matchType: 'pattern', value: 'swiggy instamart', type: 'Needs', category: 'grocery', confidence: 0.92 },
    { matchType: 'pattern', value: 'bigbasket', type: 'Needs', category: 'grocery', confidence: 0.92 },
    { matchType: 'pattern', value: 'dmart', type: 'Needs', category: 'grocery', confidence: 0.92 },
    { matchType: 'pattern', value: 'zomato', type: 'Wants', category: 'food delivery', confidence: 0.9 },
    { matchType: 'pattern', value: 'swiggy', type: 'Wants', category: 'food delivery', confidence: 0.88 },
    { matchType: 'pattern', value: 'uber', type: 'Needs', category: 'transport', confidence: 0.9 },
    { matchType: 'pattern', value: 'ola', type: 'Needs', category: 'transport', confidence: 0.9 },
    { matchType: 'pattern', value: 'rapido', type: 'Needs', category: 'transport', confidence: 0.88 },
    { matchType: 'pattern', value: 'amazon', type: 'Wants', category: 'shopping', confidence: 0.82 },
    { matchType: 'pattern', value: 'flipkart', type: 'Wants', category: 'shopping', confidence: 0.82 },
    { matchType: 'pattern', value: 'myntra', type: 'Wants', category: 'shopping', confidence: 0.86 },
    { matchType: 'pattern', value: 'nykaa', type: 'Wants', category: 'shopping', confidence: 0.82 },
    { matchType: 'pattern', value: 'apollo pharmacy', type: 'Needs', category: 'medical', confidence: 0.92 },
    { matchType: 'pattern', value: 'pharmeasy', type: 'Needs', category: 'medical', confidence: 0.9 },
    { matchType: 'pattern', value: 'netmeds', type: 'Needs', category: 'medical', confidence: 0.9 },
    { matchType: 'pattern', value: 'tata 1mg', type: 'Needs', category: 'medical', confidence: 0.9 },
    { matchType: 'pattern', value: 'netflix', type: 'Wants', category: 'entertainment', confidence: 0.9 },
    { matchType: 'pattern', value: 'spotify', type: 'Wants', category: 'entertainment', confidence: 0.9 },
    { matchType: 'pattern', value: 'hotstar', type: 'Wants', category: 'entertainment', confidence: 0.88 },
    { matchType: 'pattern', value: 'bookmyshow', type: 'Wants', category: 'entertainment', confidence: 0.88 },
    { matchType: 'pattern', value: 'groww', type: 'Savings', category: 'investment', confidence: 0.9 },
    { matchType: 'pattern', value: 'zerodha', type: 'Savings', category: 'investment', confidence: 0.9 },
    { matchType: 'pattern', value: 'upstox', type: 'Savings', category: 'investment', confidence: 0.88 }
];

async function seedGlobalMerchantRules() {
    await dbConfig();

    for (const rule of globalRules) {
        await MerchantRule.findOneAndUpdate(
            {
                userId: MerchantRule.GLOBAL_USER_ID,
                matchType: rule.matchType,
                normalizedValue: MerchantRule.normalizeValue(rule.value)
            },
            {
                $set: {
                    userId: MerchantRule.GLOBAL_USER_ID,
                    ...rule,
                    normalizedValue: MerchantRule.normalizeValue(rule.value),
                    source: 'global',
                    confirmed: true
                },
                $setOnInsert: { useCount: 0 }
            },
            { upsert: true, new: true, runValidators: true }
        );
    }

    console.log(`Seeded ${globalRules.length} global merchant rules`);
    await mongoose.disconnect();
}

seedGlobalMerchantRules().catch(async (err) => {
    console.error('Failed to seed global merchant rules:', err);
    await mongoose.disconnect();
    process.exit(1);
});

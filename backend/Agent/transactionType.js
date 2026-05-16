const openai = require('../configs/aiClient');
const MerchantRule = require('../models/merchantRuleModel');

const allowedTypes = new Set(['Needs', 'Wants', 'Savings', 'Ignore']);

const seededMerchantRules = [
    {
        label: 'grocery-delivery',
        match: /\b(blinkit|zepto|instamart|swiggy\s+instamart|bigbasket|dmart|jiomart)\b/i,
        type: 'Needs',
        category: 'grocery',
        confidence: 0.9
    },
    {
        label: 'investments',
        match: /\b(sip|mutual\s+fund|mf|rd|fd|ppf|nps|investment|groww|zerodha|upstox|kuvera|smallcase)\b/i,
        type: 'Savings',
        category: 'investment',
        confidence: 0.9
    },
    {
        label: 'medical',
        match: /\b(pharmacy|medical|medicine|hospital|clinic|doctor|apollo\s+pharmacy|pharmeasy|netmeds|tata\s+1mg)\b/i,
        type: 'Needs',
        category: 'medical',
        confidence: 0.88
    },
    {
        label: 'transport',
        match: /\b(fuel|petrol|diesel|indian\s+oil|bharat\s+petroleum|hpcl|metro|bus|train|uber|ola|rapido)\b/i,
        type: 'Needs',
        category: 'transport',
        confidence: 0.85
    },
    {
        label: 'bills-and-rent',
        match: /\b(rent|electricity|water|gas|broadband|internet|airtel|jio|bescom|bwssb)\b/i,
        type: 'Needs',
        category: 'bills',
        confidence: 0.85
    },
    {
        label: 'office-food',
        match: /\b(smartq|cafeteria|canteen)\b/i,
        type: 'Needs',
        category: 'office food',
        confidence: 0.85
    },
    {
        label: 'food-delivery',
        match: /\b(zomato|swiggy|food\s+delivery|restaurant|cafe|coffee|pizza|burger)\b/i,
        type: 'Wants',
        category: 'food delivery',
        confidence: 0.82
    },
    {
        label: 'shopping',
        match: /\b(amazon|flipkart|myntra|ajio|nykaa|mall|shopping)\b/i,
        type: 'Wants',
        category: 'shopping',
        confidence: 0.78
    },
    {
        label: 'entertainment',
        match: /\b(movie|bookmyshow|netflix|prime|spotify|hotstar|sonyliv)\b/i,
        type: 'Wants',
        category: 'entertainment',
        confidence: 0.82
    }
];

function buildSearchText(txn) {
    return [
        txn?.merchant,
        txn?.vpa,
        txn?.text
    ]
        .filter(Boolean)
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function normalizeClassification(result, txn, fallbackType = 'Needs') {
    const type = allowedTypes.has(result?.type) ? result.type : fallbackType;

    return {
        type,
        merchant: result?.merchant || txn?.merchant || 'unknown',
        category: result?.category || 'uncategorized',
        confidence: Number(result?.confidence ?? 0.4),
        source: result?.source || 'unknown',
        ruleId: result?.ruleId,
        ruleLabel: result?.ruleLabel
    };
}

function classifyBySeededRules(txn) {
    const text = buildSearchText(txn);
    if (!text) return null;

    for (const rule of seededMerchantRules) {
        if (rule.match.test(text)) {
            return normalizeClassification({
                ...rule,
                merchant: txn.merchant || 'unknown',
                source: 'seeded',
                ruleLabel: rule.label
            }, txn);
        }
    }

    return null;
}

async function classifyBySavedRule(txn, userId) {
    if (!userId) return null;

    const merchant = MerchantRule.normalizeValue(txn?.merchant);
    const vpa = MerchantRule.normalizeValue(txn?.vpa);

    const exactQueries = [];
    if (vpa) {
        exactQueries.push({ userId, matchType: 'vpa', normalizedValue: vpa });
    }
    if (merchant) {
        exactQueries.push({ userId, matchType: 'merchant', normalizedValue: merchant });
    }

    for (const query of exactQueries) {
        const savedRule = await MerchantRule.findOne(query);
        if (savedRule) {
            await MerchantRule.updateOne({ _id: savedRule._id }, { $inc: { useCount: 1 } });
            return normalizeClassification({
                type: savedRule.type,
                category: savedRule.category,
                confidence: savedRule.confidence,
                source: 'user-rule',
                ruleId: savedRule._id,
                merchant: txn.merchant
            }, txn);
        }
    }

    if (merchant) {
        const patternRules = await MerchantRule.find({ userId, matchType: 'pattern' });
        for (const savedRule of patternRules) {
            if (merchant.includes(savedRule.normalizedValue)) {
                await MerchantRule.updateOne({ _id: savedRule._id }, { $inc: { useCount: 1 } });
                return normalizeClassification({
                    type: savedRule.type,
                    category: savedRule.category,
                    confidence: savedRule.confidence,
                    source: 'user-rule',
                    ruleId: savedRule._id,
                    merchant: txn.merchant
                }, txn);
            }
        }
    }

    return null;
}

async function aiClassifyExpense(txn) {
    if (!txn || !txn.amount) {
        return { type: 'Ignore', category: 'unknown', confidence: 0.9, source: 'ai' };
    }

    const prompt = `
You classify Indian financial transactions.

Important:
- HDFC UPI emails usually do not include product names.
- Use only merchant/payee name, VPA, and description.
- If merchant is ambiguous, make the best conservative guess and keep confidence low.
- Grocery delivery merchants like Blinkit, Zepto, Swiggy Instamart are Needs/grocery.
- Plain Swiggy/Zomato restaurant food is Wants/food delivery.

Output:
- type: Needs | Wants | Savings | Ignore
- category: short Indian context
- confidence: number between 0 and 1

Transaction:
Amount: ${txn.amount} INR
Merchant: ${txn.merchant || 'unknown'}
VPA: ${txn.vpa || 'unknown'}
Description: ${txn.text || ''}

Respond ONLY in raw JSON (no markdown):
{"type":"","category":"","confidence":0.4}
`.trim();

    try {
        const res = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.1
        });

        const content = res.choices[0].message.content
            .replace(/```json|```/g, '')
            .trim();
        const parsed = JSON.parse(content);

        return {
            ...parsed,
            source: 'ai',
            confidence: Number(parsed.confidence ?? 0.45)
        };
    } catch (err) {
        console.error('AI classification error:', err.message);
        return { type: 'Needs', category: 'uncategorized', confidence: 0.35, source: 'fallback' };
    }
}

async function classifyExpense(txn, userId) {
    if (!txn || !txn.amount) {
        return normalizeClassification({ type: 'Ignore', category: 'unknown', confidence: 0.9 }, txn, 'Ignore');
    }

    if (txn.amount <= 2) {
        return normalizeClassification({
            type: 'Ignore',
            category: 'verification',
            confidence: 0.99,
            source: 'amount-rule'
        }, txn, 'Ignore');
    }

    const savedRule = await classifyBySavedRule(txn, userId);
    if (savedRule) return savedRule;

    const seededRule = classifyBySeededRules(txn);
    if (seededRule) return seededRule;

    const aiResult = await aiClassifyExpense(txn);
    return normalizeClassification(aiResult, txn);
}

module.exports = {
    classifyExpense,
    seededMerchantRules
};

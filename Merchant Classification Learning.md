# Merchant Classification Learning

## Problem

HDFC UPI emails usually do not contain product or item names. They mostly provide:

- amount
- VPA
- merchant/payee name
- transaction reference

Because of this, product-name keyword classification is unreliable. For example, Blinkit, Zepto, and Swiggy Instamart usually mean grocery and should be treated as `Needs`, while plain Swiggy or Zomato is usually food delivery and should be treated as `Wants`.

## Classification Priority

The classifier now uses this order:

1. User-saved VPA rule
2. User-saved merchant rule
3. User-saved merchant pattern rule
4. Seeded merchant rules in code
5. AI classification
6. Low-confidence fallback

VPA exact match has highest priority because it is usually the most stable identifier in UPI emails.

## Files Changed

### `backend/models/merchantRuleModel.js`

Added a new MongoDB model named `MerchantRule`.

It stores user-specific classification rules:

- `userId`
- `matchType`: `vpa`, `merchant`, or `pattern`
- `value`
- `normalizedValue`
- `type`: `Needs`, `Wants`, `Savings`, or `Ignore`
- `category`
- `confidence`
- `source`
- `useCount`

There is a unique index on:

```js
{ userId: 1, matchType: 1, normalizedValue: 1 }
```

This prevents duplicate rules for the same user and VPA/merchant.

### `backend/Agent/transactionType.js`

Reworked the classifier.

Main flow:

```js
const savedRule = await classifyBySavedRule(txn, userId);
if (savedRule) return savedRule;

const seededRule = classifyBySeededRules(txn);
if (seededRule) return seededRule;

const aiResult = await aiClassifyExpense(txn);
return normalizeClassification(aiResult, txn);
```

Seeded rules include:

- Blinkit, Zepto, Swiggy Instamart, BigBasket, Dmart, JioMart -> `Needs / grocery`
- Groww, Zerodha, Upstox, SIP, mutual fund -> `Savings / investment`
- pharmacy, hospital, medicine -> `Needs / medical`
- fuel, petrol, Uber, Ola, Rapido, metro -> `Needs / transport`
- rent, electricity, gas, broadband -> `Needs / bills`
- SmartQ, cafeteria, canteen -> `Needs / office food`
- Zomato, plain Swiggy, restaurant, cafe -> `Wants / food delivery`
- Amazon, Flipkart, Myntra, Ajio, Nykaa -> `Wants / shopping`
- Netflix, Prime, Spotify, BookMyShow -> `Wants / entertainment`

### `backend/controllers/gmailService/gmailController.js`

Updated Gmail sync classification call to pass the user id:

```js
const classification = await classifyExpense(txn, defaultUserId);
```

Without `userId`, the classifier cannot check saved merchant/VPA rules.

### `backend/controllers/expenseController.js`

Added automatic learning when an expense is updated.

If the user changes `type` or `category`, the backend creates or updates a `MerchantRule` using:

1. VPA if available
2. Merchant name if VPA is not available

Example:

```js
{
  userId: "6638bbb72ee0057ac3f3e21a",
  matchType: "vpa",
  value: "paytmqr7028oy@ptys",
  type: "Needs",
  category: "grocery",
  confidence: 0.98,
  source: "user"
}
```

Next time the same VPA appears, the saved rule is used before seeded rules or AI.

## Example

First Gmail transaction:

```txt
VPA: paytmqr7028oy@ptys
Merchant: NINGARAJU
```

If the classifier guesses incorrectly and the user updates the expense to:

```txt
type: Needs
category: grocery
```

The backend stores a VPA rule. Future transactions from `paytmqr7028oy@ptys` will automatically become:

```txt
type: Needs
category: grocery
confidence: 0.98
source: user-rule
```

## Why This Is Better

This avoids pretending that email text contains item-level detail. The system starts with known merchant patterns, then learns from the user's real corrections over time.

The most reliable signal is:

```txt
VPA exact match > merchant exact match > merchant pattern > seeded rules > AI
```

## Current Limitation

If a merchant uses many dynamic QR VPAs, exact VPA rules may not generalize. In that case, a merchant or pattern rule should be added manually later.

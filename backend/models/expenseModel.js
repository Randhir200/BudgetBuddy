const mongoose = require('mongoose');
const updateCurrentBalance = require('./plugins/updateCurrentBalance');
const { vpcaccess } = require('googleapis/build/src/apis/vpcaccess');

const payBackSchema = new mongoose.Schema({
    isPayback: { type: Boolean, default: false },
    amount: { type: Number, default: 0 }
});


const expenseSchema =  new mongoose.Schema({
    type: {type: String, required: true},
    merchant: {type: String, required: false},
    category: {type: String, required: true},
    price: {type: Number, required: true},
    item: {type: String, required: true},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
    payBack:  { type: payBackSchema, default: () => ({}) }, // empty object to allow get default value from schema
    userId : {type: String, ref: 'User', required: true},
    confidence: {type: Number, required: false},
    source: {type: String, required: false},
    vpa: {type: String, required: false},
    gmailMessageId: {type: String, required: false},
    transactionReferenceId: {type: String, required: false},
    bank: {type: String, required: false},
    accountLast4: {type: String, required: false},
    currency: {type: String, required: false}
});

expenseSchema.index(
    { userId: 1, gmailMessageId: 1 },
    {
        unique: true,
        partialFilterExpression: { gmailMessageId: { $exists: true, $type: 'string' } }
    }
);

//update current balance plugin
expenseSchema.plugin(updateCurrentBalance);

const Expense = mongoose.model('Expense', expenseSchema, 'Expense');


module.exports = Expense;

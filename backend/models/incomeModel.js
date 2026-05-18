const mongoose = require('mongoose');
const updateCurrentBalance = require('./plugins/updateCurrentBalance');
const { Schema } = mongoose;

const incomeSchema = new Schema({
    type: { type: String, required: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    description: { type: String, default: '' },
    dateRecieved: { type: Date, default: Date.now },
    updatedAt: {type: Date, default: Date.now
    },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    source: { type: String, required: false },
    merchant: { type: String, required: false },
    vpa: { type: String, required: false },
    gmailMessageId: { type: String, required: false },
    transactionReferenceId: { type: String, required: false },
    bank: { type: String, required: false },
    accountLast4: { type: String, required: false },
    currency: { type: String, required: false }

});

incomeSchema.index(
    { userId: 1, gmailMessageId: 1 },
    {
        unique: true,
        partialFilterExpression: { gmailMessageId: { $exists: true, $type: 'string' } }
    }
);

//update current balance plugin
incomeSchema.plugin(updateCurrentBalance);


const Income = mongoose.model('Income', incomeSchema, 'Income');

module.exports = Income;

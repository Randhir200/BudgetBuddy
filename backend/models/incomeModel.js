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
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }

});

//update current balance plugin
incomeSchema.plugin(updateCurrentBalance);


const Income = mongoose.model('Income', incomeSchema, 'Income');

module.exports = Income;
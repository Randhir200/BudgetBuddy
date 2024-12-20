const mongoose = require('mongoose');
const updateCurrentBalance = require('./plugins/updateCurrentBalance');

const payBackSchema = new mongoose.Schema({
    isPayback: { type: Boolean, default: false },
    amount: { type: Number, default: 0 }
});


const expenseSchema =  new mongoose.Schema({
    type: {type: String, required: true},
    category: {type: String, required: true},
    price: {type: Number, required: true},
    item: {type: String, required: true},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
    payBack:  { type: payBackSchema, default: () => ({}) }, // empty object to allow get default value from schema
    userId : {type: String, ref: 'User', required: true}
});

//update current balance plugin
expenseSchema.plugin(updateCurrentBalance);

const Expense = mongoose.model('Expense', expenseSchema, 'Expense');


module.exports = Expense;
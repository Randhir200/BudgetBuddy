const mongoose = require('mongoose');

const expenseSchema =  new mongoose.Schema({
    type: {type: String, required: true},
    category: {type: String, required: true},
    price: {type: Number, required: true},
    item: {type: String, required: true},
    createdAt: {type: Date, default: Date.now},
    userId : {type: String, ref: 'User', required: true}
});

const Expense = mongoose.model('Expense', expenseSchema, 'Expense');

module.exports = Expense;
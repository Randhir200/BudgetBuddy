const mongoose = require('mongoose');

const expenseSchema =  new mongoose.Schema({
    type: {type: [String], required: true},
    category: {type: [String], required: true},
    price: {type: Number, required: true},
    createdAt: {type: Date, default: Date.now},
    userId : {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }
});

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
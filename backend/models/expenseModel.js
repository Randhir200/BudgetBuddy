const mongoose = require('mongoose');

const expenseSchema =  new mongoose.Schema({
    type: {type: Array, required: true},
    category: {type: Array, required: true},
    price: {type: Number, required: true},
    createdAt: {type: Date, default: Date.now},
    userId : {type: mongoose.Schema.Types.ObjectId, required: true}
});

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
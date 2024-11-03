const mongoose = require('mongoose');
const updateCurrentBalance = require('./plugins/updateCurrentBalance');

const expenseSchema =  new mongoose.Schema({
    type: {type: String, required: true},
    category: {type: String, required: true},
    price: {type: Number, required: true},
    item: {type: String, required: true},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
    userId : {type: String, ref: 'User', required: true}
});

//update current balance plugin
expenseSchema.plugin(updateCurrentBalance);

const Expense = mongoose.model('Expense', expenseSchema, 'Expense');


module.exports = Expense;
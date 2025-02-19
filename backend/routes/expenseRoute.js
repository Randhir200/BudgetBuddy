const express = require('express');
const { fetchExpense, createExpense, updateExpense,
     deleteExpense,
     filteredExpenses } = require('../controllers/expenseController');
const { validateFetchExpense,
    validateCreateExpense,
    validateDeleteExpense, 
    validateUpdateExpense} = require('../middlewares/validators/validateExpense');
const expenseRoute = express.Router();

expenseRoute.get('/fetch', validateFetchExpense, fetchExpense);
expenseRoute.post('/create', validateCreateExpense, createExpense);
expenseRoute.patch('/update/:expenseId', validateUpdateExpense, updateExpense);
expenseRoute.delete('/delete/:expenseId', validateDeleteExpense, deleteExpense);
expenseRoute.get('/filtere', filteredExpenses);

module.exports = expenseRoute;

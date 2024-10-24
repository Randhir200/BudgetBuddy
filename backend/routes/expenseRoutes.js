const express = require('express');
const { fetchExpense, createExpense } = require('../controllers/expenseController');
const { validateFetchExpense, validateCreateExpense } = require('../middlewares/validators/validateExpense');
const expenseRoute = express.Router();

expenseRoute.get('/fetch', validateFetchExpense, fetchExpense);
expenseRoute.post('/create', validateCreateExpense, createExpense);

module.exports = expenseRoute
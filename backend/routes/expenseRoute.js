const express = require('express');
const getAllExpense = require('../controllers/getAllExpense');
const expenseRoute = express.Router();

expenseRoute.get('/getAllExpense', getAllExpense);
// expenseRoute.get('/createExpense', createExpense);

module.exports = expenseRoute
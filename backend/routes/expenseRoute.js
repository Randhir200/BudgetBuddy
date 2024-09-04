const express = require('express');
const getAllExpense = require('../controllers/getAllExpense');
const addExpense = require('../controllers/addExpense');
const expenseRoute = express.Router();

expenseRoute.get('/getAllExpense', getAllExpense);
expenseRoute.post('/addExpense', addExpense);

module.exports = expenseRoute
const express = require('express');
const { createExepnesType, fetchExpenseType } = require('../controllers/expenseTypeController');
const { validateCreateExpenseType, validateFetchExpenseType } = require('../middlewares/validators/validateExpenseType');

const expenseTypeRoute = express.Router();

expenseTypeRoute.get('/fetch', validateFetchExpenseType, fetchExpenseType);
expenseTypeRoute.post('/create', validateCreateExpenseType, createExepnesType);

module.exports = expenseTypeRoute;
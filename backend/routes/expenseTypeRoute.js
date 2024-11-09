const express = require('express');
const { createExepnesType, fetchExpenseType, updateExpenseType, deleteExpenseType } = require('../controllers/expenseTypeController');
const { validateCreateExpenseType, validateFetchExpenseType, validateUpdateExpenseType, validateDeleteExpenseType } = require('../middlewares/validators/validateExpenseType');

const expenseTypeRoute = express.Router();

expenseTypeRoute.get('/fetch', validateFetchExpenseType, fetchExpenseType);
expenseTypeRoute.post('/create', validateCreateExpenseType, createExepnesType);
expenseTypeRoute.patch('/update/:expenseTypeId', validateUpdateExpenseType, updateExpenseType);
expenseTypeRoute.delete('/delete/:expenseTypeId', validateDeleteExpenseType, deleteExpenseType);


module.exports = expenseTypeRoute;
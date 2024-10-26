const express = require('express');
// const getAllConfigs = require('../controllers/Config/getAllConfigs');
// const addConfig = require('../controllers/Config/addConfig');
const { createExepnesType } = require('../controllers/expenseTypeController');
const { validateCreateExpenseType } = require('../middlewares/validators/validateExpenseType');

const expenseTypeRoute = express.Router();

// expenseTypeRoute.get('/fetch', getAllConfigs);
expenseTypeRoute.post('/create', validateCreateExpenseType, createExepnesType);

module.exports = expenseTypeRoute;
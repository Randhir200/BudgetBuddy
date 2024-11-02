const express = require('express');
const expenseRoute = require('./expenseRoute');
const expenseTypeRoute = require('./expenseTypeRoute');
const incomeRoute = require('./incomeRoute');
const masterRoute = express.Router();

masterRoute.use('/expense', expenseRoute);
masterRoute.use('/expenseType', expenseTypeRoute);
masterRoute.use('/income', incomeRoute );

module.exports = masterRoute;


const express = require('express');
const expenseRoute = require('./expenseRoute');
const expenseTypeRoute = require('./expenseTypeRoute');
const incomeRoute = require('./incomeRoute');
const insightRoute = require('./insightRoute');
const masterRoute = express.Router();

masterRoute.use('/expense', expenseRoute);
masterRoute.use('/expenseType', expenseTypeRoute);
masterRoute.use('/income', incomeRoute );
masterRoute.use('/insight', insightRoute );

module.exports = masterRoute;


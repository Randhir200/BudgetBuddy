const express = require('express');
const expenseRoute = require('./expenseRoute');
const expenseTypeRoute = require('./expenseTypeRoute');
const masterRoute = express.Router();

masterRoute.use('/expense', expenseRoute);
masterRoute.use('/expenseType', expenseTypeRoute)

module.exports = masterRoute;


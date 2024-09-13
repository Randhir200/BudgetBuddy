const express = require('express');
const expenseRoute = require('./expenseRoute');
const configRoute = require('./configRoute');
const masterRoute = express.Router();

masterRoute.use('/expense', expenseRoute);
masterRoute.use('/config', configRoute)

module.exports = masterRoute;


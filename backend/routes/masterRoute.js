const express = require('express');
const expenseRoute = require('./expenseRoutes');
const configRoute = require('./configRoutes');
const masterRoute = express.Router();

masterRoute.use('/expense', expenseRoute);
masterRoute.use('/config', configRoute)

module.exports = masterRoute;


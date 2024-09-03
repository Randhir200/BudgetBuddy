const express = require('express');
const expenseRoute = require('./expenseRoute');
const masterRoute = express.Router();

masterRoute.use('/expense', expenseRoute);


module.exports = masterRoute;


const express = require('express');
const expenseRoute = require('./expenses');
const masterRoute = express.Router();

masterRoute.all('/expense', expenseRoute);


module.exports = masterRoute;


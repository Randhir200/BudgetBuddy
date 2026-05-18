const express = require('express');
const { monthlyTransactions, balance, dashboard } = require('../controllers/insightController');
const insightRoute = express.Router();

insightRoute.get('/monthlyOverview', monthlyTransactions);
insightRoute.get('/balance', balance);
insightRoute.get('/dashboard', dashboard);

module.exports = insightRoute;

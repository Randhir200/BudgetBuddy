const express = require('express');
const { monthlyTransactions, balance, dashboard, merchantAnalysis } = require('../controllers/insightController');
const insightRoute = express.Router();

insightRoute.get('/monthlyOverview', monthlyTransactions);
insightRoute.get('/balance', balance);
insightRoute.get('/dashboard', dashboard);
insightRoute.get('/merchant-analysis', merchantAnalysis);


module.exports = insightRoute;

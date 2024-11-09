const express = require('express');
const { monthlyTransactions, balance } = require('../controllers/insightController');
const insightRoute = express.Router();

insightRoute.get('/monthlyOverview', monthlyTransactions);
insightRoute.get('/balance', balance);

module.exports = insightRoute;
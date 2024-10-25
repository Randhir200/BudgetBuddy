const express = require('express');
const getAllConfigs = require('../controllers/Config/getAllConfigs');
const addConfig = require('../controllers/Config/addConfig');

const configRoute = express.Router();

configRoute.get('/getAllConfigs', getAllConfigs);
configRoute.post('/addConfig', addConfig);

module.exports = configRoute;
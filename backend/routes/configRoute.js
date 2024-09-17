const express = require('express');
const getAllConfigs = require('../controllers/Config/getAllConfigs');

const configRoute = express.Router();

configRoute.get('/getAllConfigs', getAllConfigs);
configRoute.post('/addConfig', ()=>{});

module.exports = configRoute;
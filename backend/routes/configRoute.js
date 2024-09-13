const express = require('expense');

const configRoute = express.Router();

configRoute.get('/getAllTypes', ()=>{});
configRoute.get('/getAllCategories', ()=>{});
configRoute.get('/addType', ()=>{});
configRoute.get('/addCategory', ()=>{});

module.exports = configRoute;
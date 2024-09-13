const express = require('expense');
const getAllTypes = require('../controllers/Config/getAllTypes');

const configRoute = express.Router();

configRoute.get('/getAllTypes', getAllTypes);
configRoute.get('/getAllCategories', ()=>{});
configRoute.get('/addType', ()=>{});
configRoute.get('/addCategory', ()=>{});

module.exports = configRoute;
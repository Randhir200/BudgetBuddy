const express = require('express');
const { fetchIncome,
    createIncome,
    updateIncome,
    deleteIncome } = require('../controllers/incomeController');
const { validateCreateIncome,
    validateFetchIncome,
    validateUpdateIncome,
    validateDeleteIncome } = require('../middlewares/validators/validateIncome');
const incomeRoute = express.Router();

incomeRoute.get('/fetch', validateFetchIncome, fetchIncome);
incomeRoute.post('/create', validateCreateIncome, createIncome);
incomeRoute.patch('/update/:incomeId', validateUpdateIncome, updateIncome);
incomeRoute.delete('/delete/:incomeId', validateDeleteIncome, deleteIncome);

module.exports = incomeRoute;


const joi = require('joi');
const { responseJson } = require('../utils/responseJson');
const Expense = require('../models/expenseModel');
const mongoose = require('mongoose');

const objectIdValidation = (value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.message('"{{#label}}" must be a valid ObjectId');
    }
    return value;
};

const schema = joi.object({
    type: joi.string(),
    category: joi.string(),
    price: joi.number(),
    item:joi.string(),
    userId: joi.string().custom(objectIdValidation).required(),
})
const addExpense = async (req, res) => {
    try {
        const { error, value } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            console.info(`INFO: ${error}`)
            return responseJson(res, 'badRequest', error.details.map(detail => detail.message));
        }
        const resData = await Expense.create(value);
        return responseJson(res, 'success', 'data has been uploaded', resData);

    } catch (err) {
        console.error(`ERROR: something went wrong! ${err}`)
        return responseJson(res, 'internalError', `something went wrong! ${err}`)
    }
}

module.exports = addExpense;
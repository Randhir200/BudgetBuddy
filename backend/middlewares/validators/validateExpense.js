const joi = require('joi');
const mongoose = require('mongoose');
const { responseJson } = require('../../utils/responseJson');


const objectIdValidation = (value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.message('"{{#label}}" must be a valid userId');
    }
    return value;
};

const createExpenseSchema = joi.object({
    type: joi.string().required().messages({
        'string.base': 'type must be string!',
        'any.required': 'type is required!'
    }),
    category: joi.string().required().messages({
        'string.base': 'category must be string!',
        'any.required': 'category is required!'
    }),
    price: joi.number().required().messages({
        'number.base': 'price must be number!',
        'any.required': 'price is required!'
    }),
    item: joi.string().required().messages({
        'string.base': 'item must be string!',
        'any.required': 'item is required!'
    }),
    createdAt: joi.date().required().messages({
        'string.base': 'createdAt must be string!',
        'any.required': 'createdAt is required!'
    }),
    userId: joi.string().custom(objectIdValidation).required().messages({
        'string.base': 'userId must be a string',
        'any.required': 'userId is required!'
    }),
});


const fetchExpenseSchema = joi.object({
    userId: joi.string().custom(objectIdValidation).required().messages({
        'string.base': 'userId must be a string',
        'any.required': 'userId is required!'
    }),
});


const validateExpense = (schema) => {
    return (req, res, next) => {
        // Determine the source of the data based on the request method
        const data = req.method === 'GET' ? req.query : req.body;
        const { error } = schema.validate(data);
        if (error) {
            console.info(`INFO: ${error.details[0].message}!\n`);
            return responseJson(res, 'badRequest', error.details[0].message)
        }
        next();
    };
};

module.exports = {
    validateCreateExpense: validateExpense(createExpenseSchema),
    validateFetchExpense: validateExpense(fetchExpenseSchema),
}
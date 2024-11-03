const Joi = require('joi');
const mongoose = require('mongoose');
const { responseJson } = require('../../utils/responseJson');
const  AppError  = require('../../utils/appError');


const objectIdValidation = (value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.message('Must be a valid userId');
    }
    return value;
};

const createExpenseSchema = Joi.object({
    type: Joi.string().required().messages({
        'string.base': 'type must be string!',
        'any.required': 'type is required!'
    }),
    category: Joi.string().required().messages({
        'string.base': 'category must be string!',
        'any.required': 'category is required!'
    }),
    price: Joi.number().required().messages({
        'number.base': 'price must be number!',
        'any.required': 'price is required!'
    }),
    item: Joi.string().required().messages({
        'string.base': 'item must be string!',
        'any.required': 'item is required!'
    }),
    createdAt: Joi.date().optional().messages({
        'string.base': 'createdAt must be string!',
    }),
    userId: Joi.string().custom(objectIdValidation).required().messages({
        'string.base': 'userId must be a string',
        'any.required': 'userId is required!'
    }),
});


const fetchExpenseSchema = Joi.object({
    userId: Joi.string().custom(objectIdValidation).required().messages({
        'string.base': 'userId must be a string',
        'any.required': 'userId is required!'
    }),
});

const updateExpenseSchema = Joi.object({
    expenseId: Joi.string().custom(objectIdValidation).required().messages({
        'string.base': 'expenseId must be a string',
        'any.required': 'expenseId is required!'
    }),
    type: Joi.string().optional().messages({
        'string.base': 'type must be string!'
    }),
    category: Joi.string().optional().messages({
        'string.base': 'category must be string!'
    }),
    item: Joi.string().optional().messages({
        'string.base': 'item must be string!'
    }),
    price: Joi.number().optional().messages({
        'number.base': 'amount must be a number!'
    }),
    updatedAt: Joi.date().optional().messages({
        'date.base': 'updatedAt must be a valid date!'
    }),
    userId: Joi.string().custom(objectIdValidation).required().messages({
        'string.base': 'userId must be a string',
        'any.required': 'userId is required!'
    })
});

const deleteExpenseSchema = Joi.object({
    expenseId: Joi.string().custom(objectIdValidation).required().messages({
        'string.base': 'expenseId must be a string',
        'any.required': 'expenseId is required!'
    })
});



const validateExpense = (schema) => {
    return (req, res, next) => {
        // Determine the source of the data based on the request method
        const data = req.method === 'GET'
        ? req.query
        : req.method === 'DELETE'
          ? req.params
          : req.method === 'PATCH'
            ? { ...req.params, ...req.body }
            : req.body;      
      
        const { error } = schema.validate(data);
        if (error) {
            console.error(`ERROR: ${error.details[0].message}!\n`);
            // return responseJson(res, 400, error.details[0].message)
            next(new AppError(error.details[0].message, 400))
        }
        next();
    };
};

module.exports = {
    validateCreateExpense: validateExpense(createExpenseSchema),
    validateFetchExpense: validateExpense(fetchExpenseSchema),
    validateUpdateExpense: validateExpense(updateExpenseSchema),
    validateDeleteExpense: validateExpense(deleteExpenseSchema),
}
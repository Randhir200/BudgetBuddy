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

const createIncomeSchema = Joi.object({
    type: Joi.string().required().messages({
        'string.base': 'type must be string!',
        'any.required': 'type is required!'
    }),
    category: Joi.string().required().messages({
        'string.base': 'category must be string!',
        'any.required': 'category is required!'
    }),
    amount: Joi.number().required().messages({
        'number.base': 'price must be number!',
        'any.required': 'price is required!'
    }),
    description: Joi.string().optional().messages({
        'string.base': 'item must be string!',
    }),
    dateRecieved: Joi.date().optional().messages({
        'string.base': 'createdAt must be string!',
    }),
    userId: Joi.string().custom(objectIdValidation).required().messages({
        'string.base': 'userId must be a string',
        'any.required': 'userId is required!'
    }),
});


const fetchIncomeSchema = Joi.object({
    userId: Joi.string().custom(objectIdValidation).required().messages({
        'string.base': 'userId must be a string',
        'any.required': 'userId is required!'
    }),
});

const updateIncomeSchema = Joi.object({
    incomeId: Joi.string().custom(objectIdValidation).required().messages({
        'string.base': 'incomeId must be a string',
        'any.required': 'incomeId is required!'
    }),
    type: Joi.string().optional().messages({
        'string.base': 'type must be string!'
    }),
    category: Joi.string().optional().messages({
        'string.base': 'category must be string!'
    }),
    amount: Joi.number().optional().messages({
        'number.base': 'amount must be a number!'
    }),
    description: Joi.string().optional().messages({
        'string.base': 'description must be string!'
    }),
    updatedAt: Joi.date().optional().messages({
        'date.base': 'updatedAt must be a valid date!'
    }),
    userId: Joi.string().custom(objectIdValidation).required().messages({
        'string.base': 'userId must be a string',
        'any.required': 'userId is required!'
    })
});

const deleteIncomeSchema = Joi.object({
    incomeId: Joi.string().custom(objectIdValidation).required().messages({
        'string.base': 'incomeId must be a string',
        'any.required': 'incomeId is required!'
    })
});




const validateIncome = (schema) => {
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
    validateCreateIncome: validateIncome(createIncomeSchema),
    validateFetchIncome: validateIncome(fetchIncomeSchema),
    validateUpdateIncome: validateIncome(updateIncomeSchema),
    validateDeleteIncome: validateIncome(deleteIncomeSchema),
}
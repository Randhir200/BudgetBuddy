const Joi = require('joi');
const AppError = require('../../utils/appError');
const mongoose = require('mongoose');

//custom validation
const objectIdValidation = (value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.message('Must be a valid userId');
    }
    return value;
};

const createExpenseTypeSchema = Joi.object({
    userId: Joi.string().custom(objectIdValidation).required().messages({
        'string.base': 'userId must be a string',
        'any.required': 'userId is required!'
    }),
    type: Joi.string().required().messages({
        'any.required': 'Expense type is required',
        'string.base': 'Expense must be a string',
        'any.unique': 'Expense type must be unique'
    }),
    categories: Joi.array().items(
        Joi.object({
            name: Joi.string().required().messages({
                'any.required': 'Category name is required',
                'string.base': 'Category name must be a string'
            }),
            description: Joi.string().optional().allow(null, '').messages({
                'string.base': 'Description must be a string'
            }),
            isActive: Joi.boolean().default(true).messages({
                'boolean.base': 'isActive must be a boolean'
            })
        })
    ).required().unique((a, b) => a.name === b.name)
        .messages({
            'array.unique': 'Category names must be unique',
            'any.required': 'Categories are required',
            'array.base': 'Categories must be an array'
        }),
    createdAt: Joi.date().optional(),
    updatedAt: Joi.date().optional()
});

const fetchExpenseTypeSchema = Joi.object({
    userId: Joi.string().custom(objectIdValidation).required().messages({
        'string.base': 'userId must be a string',
        'any.required': 'userId is required!'
    }),
})


const validateExpenseType = (schema) => {
    return (req, res, next) => {
        const data = req.method === 'GET' ? req.query : req.body;
        const { error } = schema.validate(data);
        if (error) {
            console.error(`ERROR: ${error.details[0].message}!\n`);
            next(new AppError(error.details[0].message, 400))
        }
        next();
    }
}

module.exports = {
    validateCreateExpenseType: validateExpenseType(createExpenseTypeSchema),
    validateFetchExpenseType: validateExpenseType(fetchExpenseTypeSchema)
}
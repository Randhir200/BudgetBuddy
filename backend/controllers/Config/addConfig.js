const Config = require('../../models/configModel');
const Joi = require('joi');

// Joi validation schema for expense type
const expenseTypeSchema = Joi.object({
  _id: Joi.string().optional(), // Optional, since it's usually auto-generated by MongoDB
  userId: Joi.string().required().messages({
    'any.required': 'User ID is required',
    'string.base': 'User ID must be a string'
  }),
  type: Joi.string().valid('Need', 'Want', 'Saving').required().messages({
    'any.required': 'Type is required',
    'any.only': 'Type must be one of ["Need", "Want", "Saving"]',
    'string.base': 'Type must be a string'
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
  ).required().messages({
    'any.required': 'Categories are required',
    'array.base': 'Categories must be an array'
  }),
  createdAt: Joi.date().optional().iso().messages({
    'date.base': 'CreatedAt must be a valid ISO date'
  }),
  updatedAt: Joi.date().optional().iso().messages({
    'date.base': 'UpdatedAt must be a valid ISO date'
  })
});

// Example usage:
const validationResult = expenseTypeSchema.validate(requestBody);
if (validationResult.error) {
  console.log(validationResult.error.details); // Handle validation error
} else {
  console.log('Validation passed!'); // Proceed with processing the request
}

const addType = async (req, res)=>{
    const {userId, type, categories} = req.body;
    try{

    }catch(err){

    }
}

module.exports = addType;
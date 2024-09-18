const Config = require('../../models/configModel');
const Joi = require('joi');
const { responseJson } = require('../../utils/responseJson');

// Joi validation schema for expense type
const expenseTypeSchema = Joi.object({
  _id: Joi.string().optional(), // Optional, since it's usually auto-generated by MongoDB
  userId: Joi.string().required().messages({
    'any.required': 'User ID is required',
    'string.base': 'User ID must be a string'
  }),
  type: Joi.string().required().messages({
    'any.required': 'Type is required',
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
  createdAt: Joi.date().optional(),
  updatedAt: Joi.date().optional()
});



const addConfig = async (req, res) => {
  try {
    // Example usage:
    const { error, value } = expenseTypeSchema.validate(req.body);
    if (error) {
      console.info(`INFO: ${error}`)
      return responseJson(res, 'badRequest', error.details.map(detail => detail.message));
    }
    const resData = await Config.create(value);
    return responseJson(res, 'success', 'Config has been uploaded', resData);

    } catch (err) {
      console.error(`ERROR: something went wrong! ${err}`)
      return responseJson(res, 'internalError', `something went wrong! ${err}`)
    }
}

module.exports = addConfig;
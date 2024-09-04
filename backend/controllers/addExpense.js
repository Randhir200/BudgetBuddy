const joi = require('joi');
const { responseJson } = require('../utils/responseJson');

const schema = joi.object({
    type: joi.array(),
    category: joi.array(),
    price: joi.number(),
    date: joi.date()
})
const addExpense = async (req, res)=>{  
    const {type, category, price, date} = req.body;
    try{
        const {error, value} = schema.validate(req.body, { abortEarly: false });
        if(error){
        console.info(`INFO: ${error}`)
        return responseJson(res, 'badRequest', error.details.map(detail => detail.message));
    }
    
}catch(err){
        console.error(`ERROR: something went wrong! ${err}`)
        return responseJson(res, 'internalError', `something went wrong! ${err}`)
    }
}

module.exports = addExpense;
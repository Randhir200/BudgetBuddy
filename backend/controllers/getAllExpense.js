const Expense = require("../models/expenseModel");
const { responseJson } = require("../utils/responseJson");
const mongoose = require('mongoose');

const getAllExpense = async (req, res)=>{
    const {userId} = req.query;
    try{        
        // Check if userId is valid and non-empty before querying
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        console.info(`INFO: Invalid or missing userId!\n`);
        return responseJson(res, "badRequest", "Invalid or missing userId");
    }

    // Query the database with a valid userId
    const expenseRaw = await Expense.find({ userId });

    // If no expense data is found, handle accordingly
    if (!expenseRaw || expenseRaw.length === 0) {
        console.info(`INFO: No expenses found for the given userId!\n`);
        return responseJson(res, "notFound", "No expenses found for the given userId");
    }

    // Return success response with the expense data
    console.info(`INFO: Expenses retrieved successfully!\n`);
    return responseJson(res, "success", "Expenses retrieved successfully", expenseRaw);
    }catch(err){
        console.error(`ERROR: Somthing went wrong! ${err} \n`);
        return responseJson(res, "internalError", `Somthing went wrong! ${err}`);
    }
}

module.exports = getAllExpense;
const Expense = require("../models/expenseModel");
const AppError = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");
const { responseJson } = require("../utils/responseJson");

exports.createExpense = catchAsync(async (req, res) => {
        const resData = await Expense.create(req.body); 
        return responseJson(res, 200, 'data has been uploaded', resData);
});

exports.fetchExpense = catchAsync(async (req, res, next) => {
    const { userId } = req.query;

    // Query the database with a valid userId
    const expenseRaw = await Expense.find({userId});
    
    // If no expense data is found, handle accordingly
    if (!expenseRaw || expenseRaw.length === 0) {
        console.info(`INFO: Expenses Doesn't found for the given userId!\n`);
        return next(new AppError(`Expenses Doesn't found for the given userId!`, 404));
    }

    // Return success response with the expense data
    console.info(`INFO: Expenses retrieved successfully!\n`);
    return responseJson(res, 200, "Expenses retrieved successfully", expenseRaw);

});

exports.updateExpense = (req, res) => { }

exports.deleteExpense = (req, res) => { }
const Expense = require("../models/expenseModel");
const AppError = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");
const { responseJson } = require("../utils/responseJson");

exports.createExpense = catchAsync(async (req, res) => {
        const resData = await Expense.create(req.body); 
        return responseJson(res, 200, 'Expense added successfully', resData);
});

exports.fetchExpense = catchAsync(async (req, res, next) => {
    const { userId } = req.query;

    // Query the database with a valid userId
    const expenses = await Expense.find({userId}).sort({createdAt: -1});
    
    // If no expense data is found, handle accordingly
    if (!expenses || expenses.length === 0) {
        console.info(`INFO: Expenses Doesn't found for the given userId!\n`);
        return next(new AppError(`Expenses Doesn't found for the given userId!`, 404));
    }

    // Return success response with the expense data
    console.info(`INFO: Expenses retrieved successfully!\n`);
    return responseJson(res, 200, "Expenses retrieved successfully", expenses);

});

exports.updateExpense = catchAsync(async (req, res, next) => {
    const { expenseId } = req.params;

    const updateExpense = await Expense.findByIdAndUpdate(
        expenseId,
        req.body,
        { new: true, runValidators: true }
    );

    if (!updateExpense) {
        return next(new AppError('Expense record not found', 404))
    }

    return responseJson(res, 200, 'Expense updated successfully!', updateExpense);

});

exports.deleteExpense = catchAsync(async (req, res, next) => {
    const { expenseId } = req.params; 

    const deletedExpense = await Expense.findByIdAndDelete(expenseId);

    if (!deletedExpense) {
        return next(new AppError('Expense record not found', 404))
    }

    return responseJson(res, 200, 'Expense deleted successfully!', deletedExpense);
})
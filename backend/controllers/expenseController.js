const Expense = require("../models/expenseModel");
const { catchAsync } = require("../utils/catchAsync");
const { responseJson } = require("../utils/responseJson");

exports.createExpense = catchAsync(async (req, res) => {
        const resData = await Expense.create(req.body);
        return responseJson(res, 'success', 'data has been uploaded', resData);
});

exports.fetchExpense = catchAsync(async (req, res) => {
    const { userId } = req.query;

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

});

exports.updateExpense = (req, res) => { }

exports.deleteExpense = (req, res) => { }
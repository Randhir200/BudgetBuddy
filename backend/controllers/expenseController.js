const Expense = require("../models/expenseModel");
const AppError = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");
const { responseJson } = require("../utils/responseJson");

exports.createExpense = catchAsync(async (req, res) => {
        const resData = await Expense.create(req.body); 
        console.info(`INFO: Expense added successfully!\n`);
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
});

exports.filteredExpenses = catchAsync(async (req, res) => {
    const { userId, type, category } = req.query;
    const matchQuery = {userId};
    if (type) matchQuery.type = type;
    if (category) matchQuery.category = category;   

    const filteredExpensesData = await Expense.aggregate([
        {
          $match: matchQuery  // Filter by selected type (e.g., "Need", "Want")
        },
        {
          $group: {
            _id: null,
            totalCount: { $sum: 1 },      // Count total records
            totalExpense: { $sum: "$price" }, // Sum total expenses
            records: { $push: "$$ROOT" }  // Collect all matching records
          }
        },
        {
          $project: {
            _id: 0,
            totalCount: 1,
            totalExpense: 1,
            records: 1
          }
        }
      ]);
    if (!filteredExpensesData || filteredExpensesData.length === 0) {
        console.info(`INFO: Filtered Expenses Doesn't found for the given userId!\n`);
        return next(new AppError(`Filtered Expenses Doesn't found for the given userId!`, 404));
    }



    // Return success response with the expense data
    console.info(`INFO: Filtered Expenses retrieved successfully!\n`);
    return responseJson(res, 200, "Filtered Expenses retrieved successfully", filteredExpensesData);
});
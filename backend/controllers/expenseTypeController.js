const ExpenseType = require("../models/expenseTypeModel");
const AppError = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");
const { responseJson } = require("../utils/responseJson");

exports.createExepnesType = catchAsync(async (req, res, next) => {
    const { type } = req.body;
    const resData = await ExpenseType.create(req.body);
    return responseJson(res, 200, 'ExpenseType has been uploaded!', resData);
})

exports.fetchExpenseType = catchAsync(async (req, res, next) => {
    const { userId } = req.query;

    // Query the database with a valid userId
    const ExpenseTypeRaw = await ExpenseType.find({ userId });
    
    console.log(ExpenseTypeRaw.length);
    // If no expense data is found, handle according"ExpenseType doesn't found for the given userId"ly
    if (!ExpenseTypeRaw || ExpenseTypeRaw.length === 0) {
        console.info(`INFO: ExpenseType doesn't found for the given userId!\n`);
        return next(new AppError("ExpenseType doesn't found for the given userId", 404))
    }

    // Return success response with the expense data
    console.info(`INFO: ExpenseTypes retrieved successfully!\n`);
    return responseJson(res, 200, "ExpenseTypes retrieved successfully", ExpenseTypeRaw);

});

exports.updateExpenseType = catchAsync(async (req, res, next) => {
    const { expenseTypeId } = req.params;

    const updateExpenseType = await ExpenseType.findByIdAndUpdate(
        expenseTypeId,
        req.body,
        { new: true, runValidators: true }
    );

    if (!updateExpenseType) {
        return next(new AppError('ExpenseType record not found', 404))
    }

    return responseJson(res, 200, 'ExpenseType updated successfully!', updateExpenseType);

});

exports.deleteExpenseType = catchAsync(async (req, res, next) => {
    const { expenseTypeId } = req.params; 
    
    const deletedExpenseType = await ExpenseType.findByIdAndDelete(expenseTypeId);

    if (!deletedExpenseType) {
        return next(new AppError('ExpenseType record not found', 404))
    }

    return responseJson(res, 200, 'ExpenseType deleted successfully!', deletedExpenseType);
});
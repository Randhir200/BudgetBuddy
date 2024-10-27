const ExpenseType = require("../models/expenseTypeModel");
const AppError = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");
const { responseJson } = require("../utils/responseJson");

exports.createExepnesType = catchAsync(async (req, res, next) => {
    const { type } = req.body;
    const resData = await ExpenseType.create(req.body);
    return responseJson(res, 200, 'Config has been uploaded!', resData);
})

exports.fetchExpenseType = catchAsync(async (req, res, next) => {
    const { userId } = req.query;

    // Query the database with a valid userId
    const ExpenseTypeRaw = await ExpenseType.find({ userId });

    // If no expense data is found, handle accordingly
    if (!ExpenseTypeRaw || ExpenseTypeRaw.length === 0) {
        console.info(`INFO: No configs found for the given userId!\n`);
        next(new AppError("No ExpenseTypes found for the given userId", 404))
    }

    // Return success response with the expense data
    console.info(`INFO: Configs retrieved successfully!\n`);
    return responseJson(res, "success", "Config retrieved successfully", ExpenseTypeRaw);

})
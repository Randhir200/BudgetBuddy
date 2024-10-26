const ExpenseType = require("../models/expenseTypeModel");
const AppError = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");
const { responseJson } = require("../utils/responseJson");

exports.createExepnesType = catchAsync(async (req, res, next) => {
    const { type } = req.body;
    const resData = await ExpenseType.create(req.body);
    return responseJson(res, 200, 'Config has been uploaded!', resData);
})
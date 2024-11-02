const { application } = require("express");
const Income = require("../models/incomeModel");
const AppError = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");
const { responseJson } = require("../utils/responseJson");

exports.createIncome = catchAsync(async (req, res) => {
    const addedData = await Income.create(req.body);
    return responseJson(res, 200, 'Income added successfully!', addedData)
});

exports.fetchIncome = catchAsync(async (req, res, next) => {
    const { userId } = req.query;
    const incomes = await Income.find({ userId });

    if (!incomes && incomes.length === 0) {
        console.info(`INFO: Income data Doesn't found for the given userId!\n`);
        return next(new AppError(`Income data Doesn't found for the given userId!`, 404));
    }

    // Return success response with the expense data
    console.info(`INFO: Incomes retrieved successfully!\n`);
    return responseJson(res, 200, "Incomes retrieved successfully", incomes);
});


exports.updateIncome = catchAsync(async (req, res, next) => {
    const { incomeId } = req.params;

    const updateIncome = await Income.findByIdAndUpdate(
        incomeId,
        req.body,
        { new: true, runValidators: true }
    );

    if (!updateIncome) {
        return next(new AppError('Income record not found', 404))
    }

    return responseJson(res, 200, 'Income updated successfully!', updateIncome);

});

exports.deleteIncome = catchAsync(async (req, res) => {
    const { incomeId } = req.params; 

    const deletedIncome = await Income.findByIdAndDelete(incomeId);

    if (!deletedIncome) {
        return next(new AppError('Income record not found', 404))
    }

    return responseJson(res, 200, 'Income deleted successfully!', deletedIncome);
})
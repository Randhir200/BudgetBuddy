const Expense = require("../models/expenseModel");
const MerchantRule = require("../models/merchantRuleModel");
const AppError = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");
const { responseJson } = require("../utils/responseJson");

async function upsertMerchantLearningRule(expense, updateBody) {
    const classificationChanged = updateBody.type || updateBody.category;
    if (!classificationChanged || !expense.userId || !expense.type || !expense.category) return;
    if (!['Needs', 'Wants', 'Savings', 'Ignore'].includes(expense.type)) return;

    const matchType = expense.vpa ? 'vpa' : expense.merchant ? 'merchant' : null;
    const value = expense.vpa || expense.merchant;
    if (!matchType || !value) return;

    await MerchantRule.findOneAndUpdate(
        {
            userId: expense.userId,
            matchType,
            normalizedValue: MerchantRule.normalizeValue(value)
        },
        {
            $set: {
                userId: expense.userId,
                matchType,
                value,
                normalizedValue: MerchantRule.normalizeValue(value),
                type: expense.type,
                category: expense.category,
                confidence: 0.98,
                source: 'user'
            }
        },
        { upsert: true, new: true, runValidators: true }
    );
}

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
//retrun total expenses count and total expense amount along with the expense data for the given userId with pagination
exports.fetchExpensePerPage = catchAsync(async (req, res, next) => {
    const { userId, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    const totalCount = await Expense.countDocuments({ userId });
    const totalExpense = await Expense.aggregate([
        { $match: { userId } },
        { $group: { _id: null, total: { $sum: "$price" } } }
    ]);
    const totalExpenseAmount = totalExpense.length > 0 ? totalExpense[0].total : 0; 
    // Query the database with a valid userId and pagination
    const expenses = await Expense.find({userId}).sort({createdAt: -1}).skip(skip).limit(Number(limit));
    
    // If no expense data is found, handle accordingly
    if (!expenses || expenses.length === 0) {
        console.info(`INFO: Expenses Doesn't found for the given userId!\n`);
        return next(new AppError(`Expenses Doesn't found for the given userId!`, 404));
    }

    // Return success response with the expense data
    console.info(`INFO: Expenses retrieved successfully!\n`);
    return responseJson(res, 200, "Expenses retrieved successfully", { expenses, totalCount, totalExpenseAmount });

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

    await upsertMerchantLearningRule(updateExpense, req.body);

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

const Balance = require("../models/balanceModel");
const Expense = require("../models/expenseModel");
const AppError = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");
const { responseJson } = require("../utils/responseJson");

exports.monthlyTransactions = catchAsync(async (req, res, next) => {
    const { userId, startDate, endDate } = req.query;

    const data = await Expense.aggregate(
        [
            {
                $match: {
                    createdAt: {
                        $gte: new Date("Fri Oct 01 2024 00:00:00 GMT+0530 (India Standard Time)"),
                        $lte: new Date("Fri Oct 31 2024 00:00:00 GMT+0530 (India Standard Time)")
                    },
                    userId
                }
            },
            {
                $group: {
                    _id: { type: "$type", category: "$category" },
                    totalCat: { $sum: 1 },
                    totalCatAmount: { $sum: "$price" }
                }
            },
            {
                $group: {
                    _id: "$_id.type",
                    categories: {
                        $push: {
                            category: "$_id.category",
                            totalCat: "$totalCat",
                            totalCatAmount: "$totalCatAmount"
                        }
                    },
                    totalTypeAmount: { $sum: "$totalCatAmount" }
                }
            },
            {
                $project: {
                    _id: 0,
                    type: "$_id",
                    categories: 1,
                    totalTypeAmount: 1
                }
            }
        ]
    );

    // console.log(`data----- ${data}`);
    if (!data || data.length === 0) {
        return next(new AppError(`Data not found`, 404));
    }

    responseJson(res, 200, 'Monthly transactions generated successfully', data);

});


exports.balance = catchAsync(async (req, res, next) => {
    const { userId } = req.query;

    const data = await Balance.find({ userId });

    if (!data || data.length === 0) {
        next(new AppError(`Balance doesn't found`, 404));
    }

    responseJson(res, 200, 'Balance retrieved successfully', data);
});

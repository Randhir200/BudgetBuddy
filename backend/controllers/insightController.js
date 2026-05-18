const Balance = require("../models/balanceModel");
const Expense = require("../models/expenseModel");
const GmailConnection = require("../models/gmailConnectionModel");
const Income = require("../models/incomeModel");
const AppError = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");
const { responseJson } = require("../utils/responseJson");

function getDateRange(firstDate, lastDate) {
    const start = firstDate ? new Date(firstDate) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const end = lastDate ? new Date(lastDate) : new Date(start.getFullYear(), start.getMonth() + 1, 0);

    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    return { start, end };
}

function getPreviousMonthRange(start) {
    const previousStart = new Date(start.getFullYear(), start.getMonth() - 1, 1);
    const previousEnd = new Date(start.getFullYear(), start.getMonth(), 0);

    previousStart.setHours(0, 0, 0, 0);
    previousEnd.setHours(23, 59, 59, 999);

    return { previousStart, previousEnd };
}

function getPercentChange(current, previous) {
    if (!previous && !current) return 0;
    if (!previous) return 100;
    return Number((((current - previous) / previous) * 100).toFixed(1));
}

function getReviewLabel(expense) {
    const confidence = Number(expense.confidence ?? 1);
    if (confidence < 0.6) return "Need Review";
    if (confidence < 0.85) return "Review";
    return "Confirmed";
}

function isMedicalCategory(category = "") {
    return /medical|medicine|health|doctor|pharma|hospital|clinic|drug/i.test(category);
}

function formatAmount(amount) {
    return `₹${Math.round(amount || 0).toLocaleString("en-IN")}`;
}

function buildMonthlyOverview(expenses) {
    const typeMap = new Map();

    expenses.forEach((expense) => {
        const type = expense.type || "Others";
        const category = expense.category || "Others";
        const amount = Number(expense.price || 0);

        if (!typeMap.has(type)) {
            typeMap.set(type, { type, totalTypeAmount: 0, categories: new Map() });
        }

        const typeData = typeMap.get(type);
        typeData.totalTypeAmount += amount;

        if (!typeData.categories.has(category)) {
            typeData.categories.set(category, { category, totalCat: 0, totalCatAmount: 0 });
        }

        const categoryData = typeData.categories.get(category);
        categoryData.totalCat += 1;
        categoryData.totalCatAmount += amount;
    });

    return Array.from(typeMap.values()).map((item) => ({
        type: item.type,
        totalTypeAmount: item.totalTypeAmount,
        categories: Array.from(item.categories.values()).sort((a, b) => b.totalCatAmount - a.totalCatAmount)
    })).sort((a, b) => b.totalTypeAmount - a.totalTypeAmount);
}

function buildInsights({ currentExpenses, previousExpenses, totalExpense, previousExpense, topMerchants, reviewStatus, topCategories }) {
    const insights = [];
    const expenseChange = getPercentChange(totalExpense, previousExpense);

    if (previousExpense > 0 && Math.abs(expenseChange) >= 10) {
        insights.push({
            type: expenseChange > 0 ? "warning" : "success",
            message: `Expenses are ${Math.abs(expenseChange)}% ${expenseChange > 0 ? "higher" : "lower"} than last month.`
        });
    }

    const needReviewCount = reviewStatus.find((item) => item.label === "Need Review")?.count || 0;
    const reviewCount = reviewStatus.find((item) => item.label === "Review")?.count || 0;
    if (needReviewCount + reviewCount > 0) {
        insights.push({
            type: "warning",
            message: `${needReviewCount + reviewCount} expenses need review before reports are fully reliable.`
        });
    }

    const topMerchantTotal = topMerchants.slice(0, 3).reduce((sum, merchant) => sum + merchant.amount, 0);
    if (totalExpense > 0 && topMerchantTotal > 0) {
        insights.push({
            type: "info",
            message: `Top 3 merchants account for ${Math.round((topMerchantTotal / totalExpense) * 100)}% of this month's spending.`
        });
    }

    const previousMedical = previousExpenses
        .filter((expense) => isMedicalCategory(expense.category))
        .reduce((sum, expense) => sum + Number(expense.price || 0), 0);
    const currentMedical = currentExpenses
        .filter((expense) => isMedicalCategory(expense.category))
        .reduce((sum, expense) => sum + Number(expense.price || 0), 0);
    const medicalChange = getPercentChange(currentMedical, previousMedical);
    if (currentMedical > 0 || previousMedical > 0) {
        insights.push({
            type: medicalChange > 0 ? "warning" : "success",
            message: `Medical spending is ${formatAmount(currentMedical)} this month, ${Math.abs(medicalChange)}% ${medicalChange > 0 ? "higher" : "lower"} than last month.`
        });
    }

    const highestCategory = topCategories[0];
    if (highestCategory) {
        insights.push({
            type: "info",
            message: `${highestCategory.category} is your highest category at ${formatAmount(highestCategory.amount)}.`
        });
    }

    return insights;
}

exports.monthlyTransactions = catchAsync(async (req, res, next) => {
    const { userId, firstDate, lastDate } = req.query;

    const data = await Expense.aggregate(
        [
            {
                $match: {
                    createdAt: {
                        $gte: new Date(firstDate),  
                        $lte: new Date( lastDate)
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

    responseJson(res, 200, 'Balance retrieved successfully', data[0]);
});

exports.dashboard = catchAsync(async (req, res) => {
    const { userId, firstDate, lastDate } = req.query;
    const { start, end } = getDateRange(firstDate, lastDate);
    const { previousStart, previousEnd } = getPreviousMonthRange(start);

    const [currentExpenses, previousExpenses, currentIncomes, previousIncomes, balanceData, gmailConnection] = await Promise.all([
        Expense.find({ userId, createdAt: { $gte: start, $lte: end } }).lean(),
        Expense.find({ userId, createdAt: { $gte: previousStart, $lte: previousEnd } }).lean(),
        Income.find({ userId, dateRecieved: { $gte: start, $lte: end } }).lean(),
        Income.find({ userId, dateRecieved: { $gte: previousStart, $lte: previousEnd } }).lean(),
        Balance.findOne({ userId }).lean(),
        GmailConnection.findOne({ userId }).lean()
    ]);

    const totalExpense = currentExpenses.reduce((sum, expense) => sum + Number(expense.price || 0), 0);
    const previousExpense = previousExpenses.reduce((sum, expense) => sum + Number(expense.price || 0), 0);
    const totalIncome = currentIncomes.reduce((sum, income) => sum + Number(income.amount || 0), 0);
    const previousIncome = previousIncomes.reduce((sum, income) => sum + Number(income.amount || 0), 0);
    const netSavings = totalIncome - totalExpense;
    const previousSavings = previousIncome - previousExpense;

    const categoryMap = new Map();
    const merchantMap = new Map();
    const reviewMap = new Map([
        ["Confirmed", { label: "Confirmed", count: 0, amount: 0 }],
        ["Review", { label: "Review", count: 0, amount: 0 }],
        ["Need Review", { label: "Need Review", count: 0, amount: 0 }]
    ]);
    const dailyMap = new Map();

    currentExpenses.forEach((expense) => {
        const amount = Number(expense.price || 0);
        const category = expense.category || "Others";
        const merchant = expense.merchant || expense.vpa || "Unknown";
        const reviewLabel = getReviewLabel(expense);
        const dateKey = new Date(expense.createdAt).toISOString().slice(0, 10);

        categoryMap.set(category, {
            category,
            count: (categoryMap.get(category)?.count || 0) + 1,
            amount: (categoryMap.get(category)?.amount || 0) + amount
        });
        merchantMap.set(merchant, {
            merchant,
            count: (merchantMap.get(merchant)?.count || 0) + 1,
            amount: (merchantMap.get(merchant)?.amount || 0) + amount
        });
        reviewMap.set(reviewLabel, {
            label: reviewLabel,
            count: reviewMap.get(reviewLabel).count + 1,
            amount: reviewMap.get(reviewLabel).amount + amount
        });
        dailyMap.set(dateKey, (dailyMap.get(dateKey) || 0) + amount);
    });

    const monthlyOverview = buildMonthlyOverview(currentExpenses);
    const topCategories = Array.from(categoryMap.values()).sort((a, b) => b.amount - a.amount).slice(0, 6);
    const topMerchants = Array.from(merchantMap.values()).sort((a, b) => b.amount - a.amount).slice(0, 6);
    const reviewStatus = Array.from(reviewMap.values());
    const dailyTrend = Array.from(dailyMap.entries())
        .map(([date, amount]) => ({ date, amount }))
        .sort((a, b) => a.date.localeCompare(b.date));

    const data = {
        range: { firstDate: start, lastDate: end, previousFirstDate: previousStart, previousLastDate: previousEnd },
        summary: {
            totalIncome,
            totalExpense,
            netSavings,
            currentBalance: balanceData?.currentBalance || 0,
            savingsRate: totalIncome ? Number(((netSavings / totalIncome) * 100).toFixed(1)) : 0,
            expenseChangePercent: getPercentChange(totalExpense, previousExpense),
            incomeChangePercent: getPercentChange(totalIncome, previousIncome),
            savingsChangePercent: getPercentChange(netSavings, previousSavings)
        },
        budgetHealth: {
            status: totalIncome && totalExpense > totalIncome ? "Risk" : totalIncome && totalExpense > totalIncome * 0.8 ? "Watch" : "Good",
            message: totalIncome && totalExpense > totalIncome
                ? "Spending is above income for this month."
                : totalIncome && totalExpense > totalIncome * 0.8
                    ? "Spending is close to monthly income."
                    : "Spending is under control for this month."
        },
        monthlyOverview,
        topCategories,
        topMerchants,
        reviewStatus,
        dailyTrend,
        gmailStatus: {
            connected: Boolean(gmailConnection?.isActive && gmailConnection?.refreshToken),
            lastSyncedAtSeconds: gmailConnection?.lastSyncedAtSeconds || null,
            lastError: gmailConnection?.lastError || ""
        }
    };

    data.insights = buildInsights({
        currentExpenses,
        previousExpenses,
        totalExpense,
        previousExpense,
        topMerchants,
        reviewStatus,
        topCategories
    });

    responseJson(res, 200, "Insight dashboard generated successfully", data);
});

const Expense = require("../models/expenseModel");

const getAllExpense = async (req, res)=>{
    // const {userId} = req.body;
    try{        
        const expenseRaw = await Expense.find({userId:"sdse"});
        const expenseData = expenseRaw.json();
         return res.status(200).json({
             status: "success",
             message: "All expenses has been fetched!",
             statusCode : 200,
             data: [...expenseData]
         })
    }catch(err){
        return res.status(500).json({
            status: "failed",
            message: `Somthing went wrong! ${err}`,
            statusCode : 500,
            data: []
        })

    }
}

module.exports = getAllExpense;
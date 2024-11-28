const AppError = require("../../utils/appError");
const { catchAsync } = require("../../utils/catchAsync");
const Balance = require("../balanceModel");

function updateCurrentBalance(schema) {
  
  // Utility function to determine balance change based on model type
  function getBalanceChange(doc, modelName) {
    return modelName === 'Income' ? doc.amount : doc.price;
  }

  // After creating an Income or Expense, update balance
  catchAsync(schema.post('save', async function (doc, next) {
    const modelName = this.constructor.modelName;

      let balance = await Balance.findOne({ userId: doc.userId });
      if (!balance) {
        balance = new Balance({ userId: doc.userId, currentBalance: 0 });
      }

      const balanceChange = getBalanceChange(doc, modelName);
      balance.currentBalance += modelName === 'Income' ? balanceChange : -balanceChange;

      await balance.save();
      
      next();
  }));

  // Before updating, store the original value for balance adjustment
  catchAsync(schema.pre('findOneAndUpdate', async function (next) {
      const docToUpdate = await this.model.findOne(this.getQuery());
      
      if (!docToUpdate) {
        // If document does not exist, skip the balance update
        return next(new AppError("Data not found to update", 404));
      }
      this._oldValue = getBalanceChange(docToUpdate, this.model.modelName);
      this._oldPayBack = docToUpdate.payBack || false;
      next();
  }));

  // After updating, adjust balance based on the difference
  catchAsync(schema.post('findOneAndUpdate', async function (doc, next) {
    const modelName = this.model.modelName;
    if (doc) {
      const newValue = getBalanceChange(doc, modelName);
      
      function handlePaybackBalance(doc, modelName, oldValue){
          if(modelName === 'Income'){
             return newValue - oldValue;
            }
            
            if(doc.payBack.isPaybakc === true){
              return oldValue;
            }
            console.log(this._oldValue);
            return oldValue - doc.payBack.amount
          }
          const balanceChange = handlePaybackBalance(doc, modelName, this._oldValue);
          

        const balance = await Balance.findOne({ userId: doc.userId });
        if (balance) {
          balance.currentBalance += balanceChange;
          await balance.save();
          console.info(`INFO: Current balance updated`);
        }
        next();
    }
  }));

  // After deleting, update balance by reversing the effect of the deleted doc
  catchAsync(schema.post('findOneAndDelete', async function (doc, next) {
    const modelName = this.model.modelName;
    if (doc) {
        const balanceChange = getBalanceChange(doc, modelName);
        const balance = await Balance.findOne({ userId: doc.userId });

        if (balance) {
          balance.currentBalance += modelName === 'Income' ? -balanceChange : balanceChange;
          await balance.save();
          console.info(`INFO: Current balance updated`);
        }
        next();
    }
  }));
}

module.exports = updateCurrentBalance;

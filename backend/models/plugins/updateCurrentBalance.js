const Balance = require("../balanceModel");

function updateCurrentBalance(schema) {

 const getBalanceChange = (doc)=>{
    const modelName = this.constructor.modelName;
    return (modelName === 'Income' ? doc.amount : doc.price);
 }

  
  // Post-save hook to update balance after creating an Income or Expense
  schema.post('save', async function (doc, next) {
    try {
      let balance = await Balance.findOne({ userId: doc.userId });
      
      // If no balance document exists, create one
      if (!balance) {
        balance = new Balance({
          userId: doc.userId,
          currentBalance: 0
        });
      }


      // Update balance depending on the model
      if (modelName === 'Income') {
        balance.currentBalance += getBalanceChange(doc);
      } else if (modelName === 'Expense') {
        balance.currentBalance -= getBalanceChange(doc);
      }

      // Save the updated balance
      await balance.save();
      next();
    } catch (error) {
      next(error); // Handle any errors
    }
  });

  // Pre-update hook to store original amount or price for balance adjustment
  schema.pre('findOneAndUpdate', async function (next) {
    try {
      const docToUpdate = await this.model.findOne(this.getQuery());

      // Store original amount or price based on model type
      this._oldValue = getBalanceChange(docToUpdate);
      next();
    } catch (error) {
      next(error);
    }
  });

  // Post-update hook to adjust balance based on difference
  schema.post('delete', async function (doc, next) {
    if (doc) {
      try {
        const newValue = getBalanceChange(doc);
        const balanceChange = this.constructor.modelName === 'Income' ? newValue - this._oldValue : this._oldValue - newValue;

        const balance = await Balance.findOne({ userId: doc.userId });

        if (balance) {
          balance.currentBalance += balanceChange;
          await balance.save();
        }
        next();
      } catch (error) {
        next(error);
      }
    }
  });

  // Post-delete hook to update balance after deleting an Income or Expense
  schema.post('findOneAndDelete', async function (doc, next) {
    if (doc) {
      try {
        const balanceChange = this.constructor.modelName === 'Income' ? -doc.amount : doc.price;
       
        const balance = await Balance.findOne({ userId: doc.userId });
        
        if (balance) {
          balance.currentBalance -= balanceChange;
          await balance.save();
        }
        next();
      } catch (error) {
        next(error);
      }
    }
  });
}

module.exports = updateCurrentBalance;

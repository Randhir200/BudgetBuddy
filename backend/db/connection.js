const mongoose = require("mongoose");

const uri = "mongodb+srv://mailrandhirkr:Budget00@cluster.bkudr.mongodb.net/BudgetBuddy";
const connection = async () => {
  try {
    await mongoose.connect(uri)
  } catch (err) {
    throw (err)
  }
}

module.exports = connection
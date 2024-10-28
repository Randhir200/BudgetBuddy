const mongoose = require("mongoose");

const uri = process.env.MONGODB_URI;
const dbConfig = async () => {
  try {
    await mongoose.connect(uri); // Options are no longer needed
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB", err);
    throw err;
  }
};

module.exports = dbConfig;

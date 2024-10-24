require("dotenv").config();
const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
const helmet = require("helmet");
const connection = require("./configs/dbConfig");
const masterRoute = require("./routes/masterRoute");
const globalErrorHandler = require("./controllers/errorController");
const AppError = require("./utils/appError");
const app = express();

app.use(express.json());

//cors
app.use(cors());

// Use Helmet to set various HTTP headers for security
app.use(helmet());

app.use(masterRoute);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
})
app.use(globalErrorHandler);

app.get("/health",async (req, res)=>{
  try{
    const mongoState = mongoose.STATES[mongoose.connection.readyState];
    
    if(mongoState === "connected"){
      res.status(200).json({
        status: "up", dbState: mongoState
      })
    }else{
      res.status(500).json({ status: "down", dbState: mongoState });    
    }
  }catch(err){
    res.status(500).json({ status: "failed", message: `something went wrong! ${err}` });    
  }
})


const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  try {
    await connection();
    console.log(`Server is working in the port ${PORT}`);
  } catch (err) {
    console.log(`somethig went wrong! ${err}`);
  }
});

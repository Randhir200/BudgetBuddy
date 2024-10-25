require("dotenv").config();
const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
const helmet = require("helmet");
const connection = require("./configs/dbConfig");
const masterRoute = require("./routes/masterRoute");
const globalErrorHandler = require("./controllers/errorController");
const AppError = require("./utils/appError");
const { catchAsync } = require("./utils/catchAsync");
const EventEmitter = require('events');
const emitter = new EventEmitter();

// uncaughtException for synchronus 
process.on('uncaughtException', err=> {
  console.log(err.name, err.message);
  console.log('uncaughtException Rejection! 💥  Shutting down...')
  process.exit(1)
})
const app = express();

app.use(express.json());

//cors
app.use(cors());

// Use Helmet to set various HTTP headers for security
app.use(helmet());

app.use(masterRoute);

//DB connection check
app.get("/health", catchAsync(async (req, res) => {
  const mongoState = mongoos.STATES[mongoose.connection.readyState];
  
  if (mongoState === "connected") {
    res.status(200).json({
      status: "up", dbState: mongoState
    })
  } else {
    res.status(500).json({ status: "down", dbState: mongoState });
  }
  
}));

//Validation for unlisted routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, async () => {
  try {
  await connection();
  console.log(`Server is working in the port ${PORT}`);
} catch (err) {
  console.log(`somethig went wrong! ${err}`);
}
 
});


// Increase the limit to 20
emitter.setMaxListeners(20);

process.on('unhandledRejection', err=> {
  console.log(err.name, err.message);
  console.log('Unhandled Rejection! 💥  Shutting down...')
  // server.close giving the time to the server to complete all request still pending.
  server.close(()=>{
    process.exit(1)
  })
})


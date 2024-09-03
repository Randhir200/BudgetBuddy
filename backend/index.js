
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const masterRoute = require("./routes/masterRoute");
const app = express();

app.use(helmet());
app.use(cors())
app.use(expenseRoute);

app.use(masterRoute);


const Port = process.env.PORT || 3000;
app.listen(Port, ()=>{
    console.log(`Server is running on port ${Port}`);
})


const express = require('express');
const expenseRoute = require('./routes/expenseRoute');
require('dotenv').config();
const cors = require('cors');
const helmet = require('helmet');
const app = express();

app.use(helmet());
app.use(cors())
app.use(expenseRoute);


const Port = process.env.PORT || 3000;
app.listen(Port, ()=>{
    console.log(`Server is running on port ${Port}`);
})
const express = require('express');
const expenseRoute = require('./routes/expenseRoute');
require('dotenv').config();
const app = express();

app.use(expenseRoute);


const Port = process.env.PORT || 3000;
app.listen(Port, ()=>{
    console.log(`Server is running on port ${Port}`);
})
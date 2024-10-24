const { responseJson } = require("../utils/responseJson");

module.exports = (err, req, res, next)=>{
    console.log(err.stack);
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    
    responseJson(res, err.status, err.message);
}


const { responseJson } = require("../utils/responseJson");

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    // err.message = err.message || 'Somthing went wrong!';
    responseJson(res, err.statusCode, err.message, undefined,  err);
}


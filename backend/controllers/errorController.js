const { responseJson } = require("../utils/responseJson");

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    responseJson(res, err.statusCode, err.message, undefined,  err);
}


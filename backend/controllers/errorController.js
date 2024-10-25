const { responseJson } = require("../utils/responseJson");



module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    responseJson(res, err, err.statusCode, err.message);

}


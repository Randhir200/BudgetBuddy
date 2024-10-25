const AppError = require('../utils/appError');
const statusMap = new Map([
    [200, 'success'],
    [201, 'created'],
    [400, 'badRequest'],
    [401, 'unauthorized'],
    [403, 'forbidden'],
    [404, 'notFound'],
    [500, 'internalError']
]);

const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
}

const handleDuplicateFieldsDB = (err)=>{
    const value = err.errmsg.match(/([" '])(\\?.)*?\1/)[0];
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new AppError(message, 400);
}

const handleValidationErrorDB = (err)=>{
    const errors = Object.values(err.errors).map(el=>el.message)
    const message = `Invalid input data. ${errors.join(', ')}`;
    return new AppError(message, 400);
}
const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    })
};

const sendErrorProd = (err, res) => {
    // Operational trusted error: send message to client
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        })

        //Programming or other unknown error: don't leak error details
    } else {
        // 1.) Log error
        console.error(`ERROR 💥`, err);
        return res.status(500).json({
            status: 'error',
            message: 'Somthing went wrong!',
        })
    }
}


exports.responseJson = (res, err = undefined, status, message, data = []) => {
    if (err) {
        if (process.env.NODE_ENV === 'development') {
            return sendErrorDev(err, res);
        } else if (process.env.NODE_ENV === 'production') {
            let error = { ...err };
            if (error.name === 'CastError') error = handleCastErrorDB(error);
            if(error.code === 11000) error = handleDuplicateFieldsDB(error);
            if(error.name === 'validationError') error = handleValidationErrorDB(error);
            return sendErrorProd(error, res);
        }
    }
    return res.status(status || 500).json({
        status: statusMap.get(status),
        message,
        data: `${status}`.startsWith('2') ? data : undefined,
        statusCode: status
    })
} 
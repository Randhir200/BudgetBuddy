class AppError extends Error {
    constructor(message, statusCode){
        super(message)

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        
        // to trace error capturing it in the stack
        Error.captureStackTrace(this, this.constructor)
    }
}

module.exports = AppError;
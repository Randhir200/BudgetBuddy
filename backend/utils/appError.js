class AppError extends Error {
   static errorMap = new Map([
        [400, 'badRequest'],
        [401, 'unauthorized'],
        [403, 'forbidden'],
        [404, 'notFound'],
        [500, 'internalError']
    ]);
    constructor(message, statusCode){
        super();
        this.statusCode = statusCode;
        this.isOperational = true;
        this.message = message;
        this.status = AppError.errorMap.get(this.statusCode);
        
        // to trace error capturing it in the stack
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;
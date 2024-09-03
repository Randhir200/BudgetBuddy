const statusMap = {
    success: 200,
    created: 201,
    badRequest: 400,
    unauthorized: 401,
    forbidden: 403,
    notFound: 404,
    internalError: 500,
};

exports.responseJson = (res, status, message, data=[])=>{
    return res.status(statusMap[status]||404).json({
        status,
        message,
        data,
        statusCode: statusMap[status]
    })
} 
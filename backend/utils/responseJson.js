const statusMap = new Map([
    [200, 'success'],
    [201, 'created'],
    [400, 'badRequest'],
    [401, 'unauthorized'],
    [403, 'forbidden'],
    [404, 'notFound'],
    [500, 'internalError']
]);

exports.responseJson = (res, status, message, data=[])=>{
    return res.status(status||500).json({
        status: statusMap.get(status),
        message,
        data: `${status}`.startsWith('2') ? data : undefined,
        statusCode: status
    })
} 
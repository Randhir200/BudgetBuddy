const statusCodes = {
  "success": 200,
  "created": 201,
  "accepted": 202,
  "noContent": 204,
  "badRequest": 400,
  "unauthorized": 401,
  "forbidden": 403,
  "notFound": 404,
  "internalServerError": 500,
  "notImplemented": 501,
  "badGateway": 502,
  "serviceUnavailable": 503
}

const responseJson = (status, message, statusCode, data=[]) =>{
    return {
        status,
        message,
        statusCode,
        data
    }
}

module.exports = responseJson;

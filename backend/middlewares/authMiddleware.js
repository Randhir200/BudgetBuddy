const AppError = require('../utils/appError');
const { verifyAppToken } = require('../utils/appToken');

function protect(req, res, next) {
    try {
        const authHeader = req.headers.authorization || '';
        const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : req.query.token;

        if (!token) {
            return next(new AppError('Authentication token is required', 401));
        }

        const payload = verifyAppToken(token);
        req.user = {
            id: payload.userId,
            email: payload.email,
            name: payload.name
        };

        next();
    } catch (err) {
        next(new AppError(err.message || 'Invalid authentication token', 401));
    }
}

function attachUserId(req, res, next) {
    if (req.user?.id) {
        req.query.userId = req.user.id;
        req.body.userId = req.user.id;
    }
    next();
}

module.exports = {
    protect,
    attachUserId
};

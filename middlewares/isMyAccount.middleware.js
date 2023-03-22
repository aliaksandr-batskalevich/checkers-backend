const {ApiError} = require('../exceptions/ApiError.js');

const isMyAccountMiddleware = (req, res, next) => {
    try {
        if (req.userId !== +req.params.id) {
            throw ApiError.ForbiddenError(`Access denied!`);
        }

        next();
    } catch (e) {
        next(e);
    }
};

module.exports = isMyAccountMiddleware;
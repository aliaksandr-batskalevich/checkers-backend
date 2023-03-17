import {ApiError} from '../exceptions/ApiError.js';

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

export default isMyAccountMiddleware;
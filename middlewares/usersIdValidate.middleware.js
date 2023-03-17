import {ApiError} from '../exceptions/ApiError.js';

const usersIdValidateMiddleware = (req, res, next) => {
    try {
        const id = req.params.id;
        if (!Number.isFinite(+id)) {
            throw ApiError.BadRequestError(`ID must be a number!`);
        }
        next();
    } catch (e) {
        next(e);
    }
};

export default usersIdValidateMiddleware;
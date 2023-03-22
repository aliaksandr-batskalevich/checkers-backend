const {validationResult} = require("express-validator");
const {ApiError} = require('../exceptions/ApiError.js');

const validateMiddleware = (req, res, next) => {
    try {
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            const errors = validationErrors.array().map(error => error.msg);
            throw ApiError.BadRequestError(`Incorrect username or password.`, errors);
        }
        next();
    } catch (e) {
        next(e);
    }
};

module.exports = validateMiddleware;
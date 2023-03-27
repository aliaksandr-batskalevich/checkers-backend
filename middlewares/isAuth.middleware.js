const {ApiError} = require('../exceptions/ApiError.js');
const tokenService = require('../services/token.service.js');
const DAL = require('../db/dal.js');


const isAuthMiddleware = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            throw ApiError.UnauthorizedError();
        }

        const accessToken = req.headers.authorization.split(' ')[1];
        if (!accessToken) {
            throw ApiError.UnauthorizedError();
        }

        const tokenPayload = tokenService.verifyAccessToken(accessToken);
        if (!tokenPayload) {
            throw ApiError.UnauthorizedError();
        }

        const user = await DAL.getUserById(tokenPayload.id);
        if (!user) {
            throw ApiError.UnauthorizedError();
        }

        req.userData = tokenPayload;
        next();

    } catch (e) {
        next(e);
    }
};

module.exports = isAuthMiddleware;
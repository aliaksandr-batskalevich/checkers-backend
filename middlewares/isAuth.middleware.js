const {ApiError} = require('../exceptions/ApiError.js');
const tokenService = require('../services/token.service.js');
const DAL = require('../db/dal.js');


const isAuthMiddleware = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            console.log('Yo1');
            throw ApiError.UnauthorizedError();
        }

        const accessToken = req.headers.authorization.split(' ')[1];
        if (!accessToken) {
            console.log('Yo2');
            throw ApiError.UnauthorizedError();
        }

        const tokenPayload = tokenService.verifyAccessToken(accessToken);
        if (!tokenPayload) {
            console.log('Yo3');
            throw ApiError.UnauthorizedError();
        }

        const user = await DAL.getUserById(tokenPayload.id);
        if (!user) {
            console.log('Yo4');
            throw ApiError.UnauthorizedError();
        }

        console.log('Yo5 - Auth middleware - ok)');
        req.userData = tokenPayload;
        next();

    } catch (e) {
        next(e);
    }
};

module.exports = isAuthMiddleware;
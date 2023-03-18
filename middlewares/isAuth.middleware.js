import {ApiError} from '../exceptions/ApiError.js';
import tokenService from '../services/token.service.js';
import DAL from '../db/dal.js';


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

export default isAuthMiddleware;
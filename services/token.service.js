import jwt from "jsonwebtoken";
import DAL from '../db/dal.js';
import {ApiError} from '../exceptions/ApiError.js';

class TokenService {
    generateTokens(payload) {
        const accessTokenExpire = process.env.JWT_ACCESS_TOKEN_EXPIRE_MIN + 'm';
        const refreshTokenExpire = process.env.JWT_REFRESH_TOKEN_EXPIRE_DAY + 'd';

        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: accessTokenExpire});
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: refreshTokenExpire});
        return {accessToken, refreshToken};
    }

    verifyAccessToken(accessToken) {
        try {
            // if the token is not valid - the method VERIFY will generate an error
            // and the catch will work
            return jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
        } catch (e) {
            return null;
        }
    }

    verifyRefreshToken(refreshToken) {
        try {
            // if the token is not valid - the method VERIFY will generate an error
            // and the catch will work
            return  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        } catch (e) {
            return null;
        }
    }

    async refreshToken(userId, refreshToken) {
        const user = await DAL.getUserById(userId);
        if (!user) {
            throw ApiError.ServerError(`Server error! User with this ID not found (refreshToken)!`);
        }

        await DAL.refreshUsersToken(userId, refreshToken);
    }

    async removeToken(refreshToken) {
        const tokenPayload = this.verifyRefreshToken(refreshToken);
        if (!tokenPayload) {
            throw ApiError.UnauthorizedError();
        }

        const {id} = tokenPayload;
        const userById = await DAL.getUserById(id);
        if (!userById || userById.refresh_token !== refreshToken) {
            throw ApiError.UnauthorizedError();
        }

        await DAL.removeUsersToken(id);
    }
}

export default new TokenService();
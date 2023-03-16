import jwt from "jsonwebtoken";
import DAL from '../db/dal.js';

class TokenService {
    generateTokens(payload) {
        const accessTokenExpire = (process.env.JWT_ACCESS_TOKEN_EXPIRE_MIN || 30) + 'm';
        const refreshTokenExpire = (process.env.JWT_REFRESH_TOKEN_EXPAIR || 30) + 'd';

        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: accessTokenExpire});
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: refreshTokenExpire});
        return {accessToken, refreshToken};
    }

    async refreshToken(userId, refreshToken) {
        const user = await DAL.getUserById(userId);
        if (!user) {
            return {status: 500, message: `Server error! User with this ID not found (refreshToken)!`};
        }

        await DAL.refreshUsersToken(userId, refreshToken);
        return {status: 200, message: `Refresh token updated!`};
    }
}

export default new TokenService();
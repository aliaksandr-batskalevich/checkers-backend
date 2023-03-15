import jwt from "jsonwebtoken";
import DAL from '../db/dal.js';

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '30m'});
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'});
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

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzIsImlhdCI6MTY3ODkwODE5MCwiZXhwIjoxNjc4OTA5OTkwfQ.XTjn7TJm2RWwjDdWXI9UxpHvEuSnKIn-Dm-RfDGSzew
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzIsImlhdCI6MTY3ODkwODMwMywiZXhwIjoxNjc4OTEwMTAzfQ.fcBxk365ot5BBdN3HnLjQUboynBiyN0RRQ-fx3d0hv0
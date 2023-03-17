import authService from '../services/auth.service.js';
import dotenv from "dotenv";

dotenv.config();

class AuthController {
    async registration(req, res, next) {
        try {
            const {message, data} = await authService.registration(req.body);

            const maxCookieAge = (process.env.JWT_REFRESH_TOKEN_EXPIRE_DAY || 30) * 24 * 60 * 60 * 1000;
            res.cookie('refreshToken', data.tokens.refreshToken, {maxAge: maxCookieAge, httpOnly: true});

            res.json({message, data});

        } catch (e) {
            next(e);
        }
    }

    async login(req, res, next) {
        try {
            const {message, data} = await authService.login(req.body);

            const maxCookieAge = (process.env.JWT_REFRESH_TOKEN_EXPIRE_DAY || 30) * 24 * 60 * 60 * 1000;
            res.cookie('refreshToken', data.tokens.refreshToken, {maxAge: maxCookieAge, httpOnly: true});

            res.json({message, data});

        } catch (e) {
            next(e);
        }
    }

    async activateAccount(req, res, next) {
        try {
            await authService.activateAccount(req.params.link);

            res.redirect(process.env.CLIENT_URL);

        } catch (e) {
            next(e);
        }
    }

    async refreshToken(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const {message, data} = await authService.refreshToken(refreshToken);

            const maxCookieAge = (process.env.JWT_REFRESH_TOKEN_EXPIRE_DAY || 30) * 24 * 60 * 60 * 1000;
            res.cookie('refreshToken', data.tokens.refreshToken, {maxAge: maxCookieAge, httpOnly: true});

            res.json({message, data})

        } catch (e) {
            next(e);
        }
    }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            await authService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json({message: `Success!`});
        } catch (e) {
            next(e);
        }
    }

}

export default new AuthController();
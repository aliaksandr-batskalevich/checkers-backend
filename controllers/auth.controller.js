const authService = require('../services/auth.service.js');
const dotenv = require("dotenv");
const {ApiError} = require('../exceptions/ApiError.js');

dotenv.config();

const maxCookieAge = (process.env.JWT_REFRESH_TOKEN_EXPIRE_DAY || 30) * 24 * 60 * 60 * 1000;
const cookieOptions = {
    maxAge: maxCookieAge,
    httpOnly: true,

    secure: true,
    sameSite: 'none'
};

class AuthController {
    async registration(req, res, next) {
        try {
            const {message, data} = await authService.registration(req.body);

            res.cookie('refreshToken', data.tokens.refreshToken, cookieOptions);

            res.json({message, data});

        } catch (e) {
            next(e);
        }
    }

    async login(req, res, next) {
        try {
            const {message, data} = await authService.login(req.body);

            res.cookie('refreshToken', data.tokens.refreshToken, cookieOptions);

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

            res.cookie('refreshToken', data.tokens.refreshToken, cookieOptions);

            res.json({message, data})

        } catch (e) {
            next(e);
        }
    }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            if (!refreshToken) {
                console.log('No Cookies!!!');
                throw ApiError.UnauthorizedError();
            }
            await authService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json({message: `Success!`});
        } catch (e) {
            next(e);
        }
    }

}

module.exports = new AuthController();
import authService from '../services/auth.service.js';
import dotenv from "dotenv";

dotenv.config();

class AuthController {
    async registration(req, res) {
        try {
            const result = await authService.registration(req.body);
            const {status, message, data} = result;

            if (status < 200 || status > 299) {
                return res.status(status).json({message});
            }

            const maxCookieAge = (process.env.JWT_REFRESH_TOKEN_EXPIRE_DAY || 30) * 24 * 60 * 60 * 1000;
            res.cookie('refreshToken', data.tokens.refreshToken, {maxAge: maxCookieAge, httpOnly: true});

            res.json({message, data});

        } catch (e) {
            console.log(e);
            res.status(500).json({message: `Some server error!`});
        }
    }

    async login(req, res) {
        try {
            const result = await authService.login(req.body);
            const {status, message, data} = result;

            if (status < 200 || status > 299) {
                return res.status(status).json({message});
            }

            res.json({message, data});

        } catch (e) {
            console.log(e);
            res.status(500).json({message: `Some server error!`});
        }
    }

    async activateAccount(req, res) {
        try {
            const result = await authService.activateAccount(req.params.link);
            const {status, message} = result;

            if (status < 200 || status > 299) {
                return res.status(status).json({message});
            }

            res.redirect(process.env.CLIENT_URL)

        } catch (e) {
            console.log(e);
            res.status(500).json({message: `Some server error!`});
        }
    }

    async logout(req, res) {

    }

}

export default new AuthController();
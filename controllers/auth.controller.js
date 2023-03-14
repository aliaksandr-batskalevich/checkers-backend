import authService from '../services/auth.service.js';

class AuthController {
    async registration(req, res) {
        try {
            const result = await authService.registration(req.body);
            const {status, message} = result;

            if (status < 200 || status > 299) {
                return res.status(status).json({message});
            }

            res.json({message});

        } catch (e) {
            console.log(e);
            res.status(500).json({message: `Some server error!`});
        }
    }

    async login(req, res) {
        try {
            const result = await authService.login(req.body);
            const {status, message, token} = result;

            if (status < 200 || status > 299) {
                return res.status(status).json({message});
            }

            res.json({message, token});

        } catch (e) {
            console.log(e);
            res.status(500).json({message: `Some server error!`});
        }
    }

}

export default new AuthController();
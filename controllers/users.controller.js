import usersService from '../services/users.service.js';

class UsersController {
    async getAllUsers(req, res) {
        try {
            const {status, message, data} = await usersService.getAllUsers();

            if (status < 200 || status > 299) {
                return res.status(status).json({message});
            }

            res.json({message, data});

        } catch (e) {
            res.status(500).json({message: `Some server error!`});
        }
    }

    async getUser(req, res) {
        try {
            const {status, message, data} = await usersService.getUserById(req.params.id);
            if (status < 200 || status > 299) {
                return res.status(status).json({message});
            }

            res.json({message, data});

        } catch (e) {
            console.log(e);
            res.status(500).json({message: `Some server error!`});
        }
    }

    async deleteUser(req, res) {
        try {
            const {status, message} = await usersService.deleteUser(+req.params.id);
            if (status < 200 || status > 299) {
                return res.status(status).json({message});
            }

            res.json({message});

        } catch (e) {
            console.log(e);
            res.status(500).json({message: `Some server error!`});
        }
    }
}

export default new UsersController();
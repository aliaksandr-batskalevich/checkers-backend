import usersService from '../services/users.service.js';

class UsersController {
    async getAllUsers(req, res, next) {
        try {
            const {message, data} = await usersService.getAllUsers();

            res.json({message, data});

        } catch (e) {
            next(e);
        }
    }

    async getUser(req, res, next) {
        try {
            const {message, data} = await usersService.getUserById(req.params.id);

            res.json({message, data});

        } catch (e) {
            next(e);
        }
    }

    async deleteUser(req, res, next) {
        try {
            const {message} = await usersService.deleteUser(+req.params.id);

            res.json({message});

        } catch (e) {
            next(e);
        }
    }
}

export default new UsersController();
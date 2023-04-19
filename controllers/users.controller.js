const usersService = require('../services/users.service.js');

class UsersController {

    async getAllUsers(req, res, next) {
        try {
            const authUserId = req.userData.id;
            const {count, page} = req.query;
            const {message, data} = await usersService.getAllUsers(authUserId, count, page);

            res.json({message, data});

        } catch (e) {
            next(e);
        }
    }

    async getUser(req, res, next) {
        try {
            const authUserId = req.userData.id;
            const userId = req.params.id;
            const {message, data} = await usersService.getUserById(authUserId, userId);

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

module.exports = new UsersController();
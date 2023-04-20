const usersService = require('../services/users.service.js');

class TopController {
    async getTop10(req, res, next) {
        try {
            const authUserId = req.userData.id;
            const {count} = req.query;
            const {message, data} = await usersService.getTopUsers(authUserId, count);

            res.json({message, data});
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new TopController();
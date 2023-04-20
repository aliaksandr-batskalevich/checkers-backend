const statusService = require('../services/status.service.js');

class StatusController {

    async createUserStatus(req, res, next) {
        try {
            const userId = req.userData.id;

            const {message, data} = await statusService.createUserStatus(userId, req.body);

            res.json({message, data});
        } catch (e) {
            next(e);
        }
    }

}

module.exports = new StatusController();
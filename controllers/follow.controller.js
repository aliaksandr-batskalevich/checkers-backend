const followService = require('../services/follow.service.js');

class FollowController {

    async follow(req, res, next) {
        try {
            const subscriberId = req.userData.id;
            const {id} = req.params;

            const {message, data} = await followService.follow(id, subscriberId);

            res.json({message, data});
        } catch (e) {
            next(e);
        }
    }

    async unFollow(req, res, next) {
        try {
            const subscriberId = req.userData.id;
            const {id} = req.params;

            const {message, data} = await followService.unFollow(id, subscriberId);

            res.json({message, data});
        } catch (e) {
            next(e);
        }
    }

}

module.exports = new FollowController();
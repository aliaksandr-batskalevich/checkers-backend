const topService = require("../services/top.service.js");

class TopController {
    async getTop10(req, res, next) {
        try {
            const {count} = req.params;
            const {message, data} = await topService.getTop(count);

            res.json({message, data});
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new TopController();
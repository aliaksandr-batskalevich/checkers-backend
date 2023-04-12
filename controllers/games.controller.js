const gameService = require('../services/games.service.js');

class GamesController {

    async createGame(req, res, next) {
        try {
            const userId = req.userData.id;
            const reqBody = req.body;

            const {message, data} = await gameService.createGame(userId, reqBody);

            res.json({message, data});
        } catch (error) {
            next(error);
        }
    }

    async getGames(req, res, next) {
        try {
            const userId = req.userData.id;
            const {count, page, filter} = req.query;

            const {message, data} = await gameService.getGames(userId, count, page, filter);

            res.json({message, data});

        } catch (error) {
            next(error);
        }
    }

    async getGame(req, res, next) {
        try {
            const userId = req.userData.id;
            const {id} = req.params;

            const {message, data} = await gameService.getGame(userId, id);

            res.json({message, data});
        } catch (error) {
            next(error);
        }
    }

    async updateGame(req, res, next) {
        try {
            const userId = req.userData.id;
            const {id} = req.params;
            const body = req.body;

            const {message, data} = await gameService.updateGame(userId, id, body);

            res.json({message, data});
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new GamesController();
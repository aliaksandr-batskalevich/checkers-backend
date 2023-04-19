const DAL = require('../db/dal.js');
const statisticService = require('./statistics.service.js');
const {ApiError} = require("../exceptions/ApiError.js");
const {gameDtoMaker, gameProgressDtoMaker, orderSwitcher} = require('../utils/utils.js');



class GamesService {

    async createGame(userId, reqBody) {

        const {level, currentOrder, figures} = reqBody;
        if (!level) {
            throw ApiError.BadRequestError('Request must have "level"!');
        }

        const timeStart = new Date().toUTCString();

        const createdGame = await DAL.createGame(userId, timeStart, level);
        const createdGameProgress = await DAL.createGameProgress(createdGame.id, currentOrder, figures);

        // change statistics
        await statisticService.incrementGamesCount(userId);

        const createdGameDto = gameDtoMaker(createdGame);

        return {message: 'Success!', data: {game: createdGameDto}};
    }

    async getGames(userId, count, page, filter) {

        let data;

        switch (filter) {
            case 'progress': {
                data = await DAL.getInProgressGames(userId, count, page);
                break;
            }
            case 'completed': {
                data = await DAL.getCompletedGames(userId, count, page);
                break;
            }
            case 'successful': {
                data = await DAL.getSuccessfulGames(userId, count, page);
                break;
            }
            default: {
                data = await DAL.getAllGames(userId, count, page);
                break;
            }
        }

        const {totalCount, games} = data;
        const gamesDto = games.map(gameDtoMaker);

        return {message: 'Success!', data: {totalCount, games: gamesDto}};
    }

    async getGame(userId, gameId) {
        const game = await DAL.getGame(gameId);
        if (!game || game.user_id !== userId) {
            throw ApiError.ForbiddenError('Access denied!');
        }

        const gameProgress = await DAL.getGameProgress(gameId);

        const gameDto = gameDtoMaker(game);
        const gameProgressDto = gameProgressDtoMaker(gameProgress);

        return {message: 'Success!', data: {game: gameDto, progress: gameProgressDto}};

    }

    async updateGame(userId, gameId, body) {
        const {status, figures, isWon} = body;
        if (!status ) {
            throw ApiError.BadRequestError(`Bad request! Check body of request.`);
        }

        const gameResponse = await this.getGame(userId, gameId);
        const {game, progress} = gameResponse.data;

        let updatedGame;
        let updatedProgress;

        switch (status) {
            case 'step': {
                if (!figures) {
                    throw ApiError.BadRequestError(`Bad request! Check body of request.`);
                }

                // currentOrder in camelCase - object from method getGame (DTO object)
                const newCurrentOrder = orderSwitcher(progress.currentOrder);

                updatedGame = game;
                updatedProgress = await DAL.updateGameProgress(gameId, newCurrentOrder, figures);

                break;
            }
            case 'finish': {
                if (isWon === undefined) {
                    throw ApiError.BadRequestError(`Bad request! Check params or body of request.`);
                }

                const timeEnd = new Date().toUTCString();

                updatedGame = await DAL.finishGame(gameId, timeEnd, isWon);
                updatedProgress = progress;

                // change statistics
                isWon && await statisticService.incrementGamesWinsCount(userId);

                break;
            }
            default:
                throw ApiError.BadRequestError(`Bad request! Check body of request.`);
        }

        const gameDto = gameDtoMaker(updatedGame);
        const gameProgressDto = gameProgressDtoMaker(updatedProgress);

        return {message: 'Success!', data: {game: gameDto, progress: gameProgressDto}};
    }
}

module.exports = new GamesService();
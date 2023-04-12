const DAL = require('../db/dal.js');

class StatisticsService {
    _removeDbProperties(userStatistics) {
        const {id, user_id, ...restStatistics} = userStatistics;
        return restStatistics;
    }

    async createUserStatistics(user) {
        const createdUserStatistics = await DAL.createUserStatistics(user.id);
        const statisticsToSend = this._removeDbProperties(createdUserStatistics);

        return {...user, ...statisticsToSend};
    }

    async removeUserStatistics(userId) {
        await DAL.removeUserStatistics(userId);
    }

    async getUserStatistics(userId) {
        const userStatistics = await DAL.getUserStatistics(userId);
        return userStatistics;
    }

    async addStatisticsDataToUser(user) {
        const userStatistics = await this.getUserStatistics(user.id);
        const statisticsToSend = this._removeDbProperties(userStatistics);

        return {...user, ...statisticsToSend};
    }

    async _updateRating(userId) {
        const gameFactor = 10;
        const sparringFactor = 100;

        const userStatistics = await this.getUserStatistics(userId);
        const {games_count, games_wins_count, sparring_count, sparring_wins_count} = userStatistics;
        const newRating = Math.floor(games_wins_count / (games_count || 1) * games_count * gameFactor + sparring_wins_count / (sparring_count || 1) * sparring_count * sparringFactor);
        const newStatistics = await DAL.updateUserRating(userId, newRating);

        return newStatistics;
    }

    async incrementGamesCount(userId) {
        await DAL.incrementGamesCount(userId);
        const newStatistics = await this._updateRating(userId);

        return newStatistics;
    }

    async incrementGamesWinsCount(userId) {
        await DAL.incrementGamesWinsCount(userId);
        const newStatistics = await this._updateRating(userId);

        return newStatistics;
    }

    async incrementSparringCount(userId) {
        await DAL.incrementSparringCount(userId);
        const newStatistics = await this._updateRating(userId);

        return newStatistics;
    }

    async incrementSparringWinsCount(userId) {
        await DAL.incrementSparringWinsCount(userId);
        const newStatistics = await this._updateRating(userId);

        return newStatistics;
    }

}

module.exports = new StatisticsService();
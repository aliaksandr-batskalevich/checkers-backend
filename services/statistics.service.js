const DAL = require('../db/dal.js');

class StatisticsService {

    statisticsToSendMaker(statistics) {
        const {id, user_id, ...statisticsToSend} = statistics;

        return statisticsToSend;
    }

    async createUserStatistics(user) {
        const createdUserStatistics = await DAL.createUserStatistics(user.id);
        const statisticsToSend = this.statisticsToSendMaker(createdUserStatistics);

        return {...user, ...statisticsToSend};
    }

    async removeUserStatistics(userId) {
        await DAL.removeUserStatistics(userId);
    }

    async _getUserStatistics(userId) {
        const userStatistics = await DAL.getUserStatistics(userId);

        return userStatistics;
    }

    async addStatisticsDataToUser(user) {
        const userStatistics = await this._getUserStatistics(user.id);
        const statisticsToSend = this.statisticsToSendMaker(userStatistics);

        return {...user, ...statisticsToSend};
    }

    async addStatisticsDataToUsers(users) {
        const usersIdArr = users.map(user => user.id);

        const usersStatistics = await DAL.getUsersStatistics(usersIdArr);

        const usersWithStatistics = users.map(user => {
            const statistics = usersStatistics.find(us => us.user_id === user.id);
            const statisticsToSend = this.statisticsToSendMaker(statistics);

            return {...user, ...statisticsToSend};
        });

        return usersWithStatistics;
    }

    async getTopStatistics(count) {
        const topStatistics = await DAL.getTopStatistics(count);

        return topStatistics;
    }

    async _updateRating(userId) {
        const gameFactor = 10;
        const sparringFactor = 100;
        const subscriberFactor = 20;

        const userStatistics = await this._getUserStatistics(userId);
        const {subscribers_count, games_count, games_wins_count, sparring_count, sparring_wins_count} = userStatistics;
        const newRating = Math.floor(
            games_wins_count / (games_count || 1) * games_count * gameFactor
            + sparring_wins_count / (sparring_count || 1) * sparring_count * sparringFactor
            + subscribers_count * subscriberFactor);

        const newStatistics = await DAL.updateUserRating(userId, newRating);
        const newStatisticsToSend = this.statisticsToSendMaker(newStatistics);

        return newStatisticsToSend;
    }

    async incrementSubscribersCount(userId) {
        await DAL.incrementSubscribersCount(userId);

        const newStatisticsToSend = await this._updateRating(userId);

        return newStatisticsToSend;
    }

    async decrementSubscribersCount(userId) {
        await DAL.decrementSubscribersCount(userId);

        const newStatisticsToSend = await this._updateRating(userId);

        return newStatisticsToSend;
    }

    async incrementGamesCount(userId) {
        await DAL.incrementGamesCount(userId);
        const newStatisticsToSend = await this._updateRating(userId);

        return newStatisticsToSend;
    }

    async incrementGamesWinsCount(userId) {
        await DAL.incrementGamesWinsCount(userId);
        const newStatisticsToSend = await this._updateRating(userId);

        return newStatisticsToSend;
    }

    async incrementSparringCount(userId) {
        await DAL.incrementSparringCount(userId);
        const newStatisticsToSend = await this._updateRating(userId);

        return newStatisticsToSend;
    }

    async incrementSparringWinsCount(userId) {
        await DAL.incrementSparringWinsCount(userId);
        const newStatisticsToSend = await this._updateRating(userId);

        return newStatisticsToSend;
    }

}

module.exports = new StatisticsService();
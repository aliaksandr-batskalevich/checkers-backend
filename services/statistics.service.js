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

    async addStatisticsDataToUser(user) {
        const userStatistics = await DAL.getUserStatistics(user.id);
        const statisticsToSend = this._removeDbProperties(userStatistics);

        return {...user, ...statisticsToSend};
    }

}

module.exports = new StatisticsService();
const DAL = require('../db/dal.js');
const dotenv = require("dotenv");
const {ApiError} = require('../exceptions/ApiError.js');

dotenv.config();

class StatisticsService {

    statisticsToSendMaker(statistics) {
        const {id, user_id, ...statisticsToSend} = statistics;

        return statisticsToSend;
    }

    gameRatingCounter(count, wins, factor) {
        console.log('rating counter');
        const gameRating = factor * count * (1 - (count - wins) / (count || 1)) ** 2;
        console.log(gameRating);
        return gameRating;
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
        console.log('update rating');

        const gameJuniorFactor = +process.env.GAME_JUNIOR_FACTOR || 1;
        const gameMiddleFactor = +process.env.GAME_MIDDLE_FACTOR || 5;
        const gameSeniorFactor = +process.env.GAME_SENIOR_FACTOR || 10;
        const sparringFactor = +process.env.SPARRING_FACTOR || 50;
        const subscriberFactor = +process.env.SUBSCRIBER_FACTOR || 10;

        const userStatistics = await this._getUserStatistics(userId);
        const {
            subscribers_count,

            games_junior_count,
            games_middle_count,
            games_senior_count,
            games_junior_wins_count,
            games_middle_wins_count,
            games_senior_wins_count,

            sparring_count,
            sparring_wins_count
        } = userStatistics;

        const newRating = (
            this.gameRatingCounter(games_junior_count, games_junior_wins_count, gameJuniorFactor)
            + this.gameRatingCounter(games_middle_count, games_middle_wins_count, gameMiddleFactor)
            + this.gameRatingCounter(games_senior_count, games_senior_wins_count, gameSeniorFactor)
            + this.gameRatingCounter(sparring_count, sparring_wins_count, sparringFactor)
            + subscribers_count * subscriberFactor)
            .toFixed(2);

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

    async incrementGamesCount(userId, level) {
        switch (level) {
            case 1: {
                await DAL.incrementGamesJuniorCount(userId);
                break;
            }
            case 2: {
                await DAL.incrementGamesMiddleCount(userId);
                break;
            }
            case 3: {
                await DAL.incrementGamesSeniorCount(userId);
                break;
            }
            default: throw ApiError.BadRequestError('Invalid level value.');
        }

        console.log('inc');
        const newStatisticsToSend = await this._updateRating(userId);

        return newStatisticsToSend;
    }

    async incrementGamesWinsCount(userId, level) {
        switch (level) {
            case 1: {
                await DAL.incrementGamesJuniorWinsCount(userId);
                break;
            }
            case 2: {
                await DAL.incrementGamesMiddleWinsCount(userId);
                break;
            }
            case 3: {
                await DAL.incrementGamesSeniorWinsCount(userId);
                break;
            }
            default: throw ApiError.BadRequestError('Invalid level value.');
        }
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
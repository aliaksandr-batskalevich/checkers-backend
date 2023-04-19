const DAL = require('../db/dal.js');
const usersService = require('../services/users.service.js');
const statisticsService = require('./statistics.service.js');
const {ApiError} = require("../exceptions/ApiError.js");

class FollowService {

    async follow(userId, authUserId) {

        // check USER
        await usersService.getUserById(authUserId, userId);

        const userSubscriber = await DAL.getUserSubscriber(userId, authUserId);
        if (userSubscriber) {
            throw ApiError.BadRequestError(`You are already following this user!`);
        }

        const timeUTC = new Date().toUTCString();

        await DAL.follow(userId, authUserId, timeUTC);

        // UPDATE statistics
        await statisticsService.incrementSubscribersCount(userId);

        const {message, data} = await usersService.getUserById(authUserId, userId);

        return {message: 'Success!', data};
    }

    async unFollow(userId, authUserId) {

        // check USER
        await usersService.getUserById(authUserId, userId);

        const userSubscriber = await DAL.getUserSubscriber(userId, authUserId);
        if (!userSubscriber) {
            throw ApiError.BadRequestError(`You are not subscribed to this user!`);
        }

        await DAL.unFollow(userId, authUserId);

        // UPDATE statistics
        const newUserStatistics = await statisticsService.decrementSubscribersCount(userId);

        const {message, data} = await usersService.getUserById(authUserId, userId);

        return {message: 'Success!', data};
    }

    // async removeUserSubscribers(userId) {
    //     await DAL.removeUserSubscribers(userId);
    // }

}

module.exports = new FollowService();
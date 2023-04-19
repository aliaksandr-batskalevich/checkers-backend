const statisticsService = require('./statistics.service.js');
const DAL = require('../db/dal.js');
const {userDtoMaker} = require("../utils/utils.js");
const {ApiError} = require('../exceptions/ApiError.js');

class UsersService {

    async getUserById(authUserId, userId) {

        const user = await DAL.getUserById(userId);
        if (!user) {
            throw ApiError.BadRequestError(`No users with this ID!`);
        }

        const userWithStatistics = await statisticsService.addStatisticsDataToUser(user);

        const isFollowed = !!(await DAL.getUserSubscriber(userId, authUserId));

        const userToSend = userDtoMaker({...userWithStatistics, isFollowed});

        return {message: `Success!`, data: {user: userToSend}};

    }

    async getAllUsers(authUserId, count, page) {

        // GET users with statistics from DB
        const {users, totalCount} = await DAL.getAllUsersWithStatistics(count, page);
        if (page !== 1 && !users.length) {
            throw ApiError.BadRequestError(`No users in this page!`);
        }

        const usersBySubscriber = await DAL.getUsersBySubscriber(authUserId);
        const usersWithIsFollowed = users.map(user => {
            const isFollowed = !!usersBySubscriber.find(u => u.user_id === user.id);
            return {...user, isFollowed};
        });

        const usersToSend = usersWithIsFollowed.map(userDtoMaker);

        return {message: `Success`, data: {totalCount, users: usersToSend}};
    }

    async getTopUsers(count) {
        const topUsers = await DAL.getTopUsersWithStatistics(count);

        const topUsersToSend = topUsers.map(userDtoMaker);

        return {message: `Success!`, data: {topUsers: topUsersToSend}};
    }

    async deleteUser(id) {
        const deletedUser = await DAL.deleteUserById(id);
        if (!deletedUser) {
            throw ApiError.BadRequestError(`User whit id: ${id} not found!`);
        }

        await statisticsService.removeUserStatistics(id);
        // await followService.removeUserSubscribers(id);

        return {message: `User ${deletedUser.username} deleted!`};

    }

}

module.exports = new UsersService();
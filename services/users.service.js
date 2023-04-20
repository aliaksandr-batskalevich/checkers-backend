const statisticsService = require('./statistics.service.js');
const statusService = require('./status.service.js');
const DAL = require('../db/dal.js');
const {userDtoMaker} = require("../utils/utils.js");
const {ApiError} = require('../exceptions/ApiError.js');

class UsersService {

    async addFollowedDataToUsers(authUserId, users) {
        const usersBySubscriber = await DAL.getUsersBySubscriber(authUserId);
        const usersWithIsFollowed = users.map(user => {
            const isFollowed = !!usersBySubscriber.find(u => u.user_id === user.id);
            return {...user, isFollowed};
        });

        return usersWithIsFollowed;
    }

    async getUserById(authUserId, userId) {

        const user = await DAL.getUserById(userId);
        if (!user) {
            throw ApiError.BadRequestError(`No users with this ID!`);
        }

        const userWithStatistics = await statisticsService.addStatisticsDataToUser(user);

        const userWithStatus = await statusService.addLastStatusToUser(userWithStatistics);

        // con not postpone in followService - obsession
        const isFollowed = !!(await DAL.getUserSubscriber(userId, authUserId));

        const userToSend = userDtoMaker({...userWithStatus, isFollowed});

        return {message: `Success!`, data: {user: userToSend}};

    }

    async getAllUsers(authUserId, count, page) {

        // GET users
        const {users, totalCount} = await DAL.getAllUsers(count, page);
        if (page !== 1 && !users.length) {
            throw ApiError.BadRequestError(`No users in this page!`);
        }

        // ADD isFollowed data
        const usersWithFollowed = await this.addFollowedDataToUsers(authUserId, users);

        // ADD status data
        const usersWithStatuses = await statusService.addLastStatusesToUsers(usersWithFollowed);

        // ADD statistics data
        const usersWithStatistics = await statisticsService.addStatisticsDataToUsers(usersWithStatuses);

        const usersToSend = usersWithStatistics.map(userDtoMaker);

        return {message: `Success`, data: {totalCount, users: usersToSend}};
    }

    async getTopUsers(authUserId, count) {

        // GET topUsersId
        const topStatistics = await statisticsService.getTopStatistics(count);

        const topUsersId = topStatistics.map(ts => ts.user_id);

        // GET users by topUsersId
        const topUsers = await DAL.getUsersByIdArr(topUsersId);

        // ADD isFollowed data
        const topUsersWithFollowed = await this.addFollowedDataToUsers(authUserId, topUsers);

        // ADD status data
        const topUsersWithStatuses = await statusService.addLastStatusesToUsers(topUsersWithFollowed);

        // ADD statistics data
        const topUsersWithStatistics = await statisticsService.addStatisticsDataToUsers(topUsersWithStatuses);
        const topUsersWithStatisticsSort = topUsersWithStatistics.sort((a, b) => b.rating - a.rating);

        const topUsersToSend = topUsersWithStatisticsSort.map(userDtoMaker);

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
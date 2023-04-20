const DAL = require('../db/dal.js');
const {ApiError} = require("../exceptions/ApiError.js");

class StatusService {

    async createUserStatus(userId, body) {
        const status = body.status;
        if (status === undefined) {
            throw ApiError.BadRequestError('No statusData in request!');
        }

        const timeUTC = new Date().toUTCString();

        const createdStatus = await DAL.createUserStatus(userId, status, timeUTC);

        return {message: 'Success!', data: {status: createdStatus.status}};
    }

    async addLastStatusToUser(user) {
        const lastStatus = await DAL.getLastUserStatus(user.id);

        return {...user, status: lastStatus ? lastStatus.status : null};
    }

    async addLastStatusesToUsers(users) {
        const usersIdArr = users.map(user => user.id);

        const lastStatuses = await DAL.getLastUsersStatuses(usersIdArr);

        const usersWithStatuses = users.map(user => {
            const lastStatus = lastStatuses.find(ls => ls.user_id === user.id);

            return {...user, status: lastStatus ? lastStatus.status : null};
        });

        return usersWithStatuses;
    }

}

module.exports = new StatusService();
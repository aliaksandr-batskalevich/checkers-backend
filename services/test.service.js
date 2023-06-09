const DAL = require('../db/dal.js');
const {userDtoMaker} = require("../utils/utils.js");
const {ApiError} = require('../exceptions/ApiError.js');


class TestService {
    async getTest() {
        console.log(`Test request!`);
        const {users, totalCount} = await DAL.getAllUsersWithStatistics();
        const usersToSend = users.map(userDtoMaker);
        return {message: `Success`, data: {totalCount, users: usersToSend}};
    }

    async createTest() {
        console.log(`Test request!`);
        const data = await new Promise((res, rej) => {
            const timeoutId = setTimeout(() => {
                res({fullMessage: 'You have successfully subscribed to the email newsletter'});
            }, 3000);
        });
        return {message: `Success!`, data};
    }

    async errorTest() {
        ApiError.BadRequestError(`Some error (test) :)`);
    }

}

module.exports = new TestService();
const DAL = require('../db/dal.js');
const {userDtoMaker} = require("../utils/utils.js");


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
                res({});
            }, 3000);
        });
        return {message: `Success!`, data};
    }
}

module.exports = new TestService();
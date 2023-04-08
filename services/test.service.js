const DAL = require('../db/dal.js');
const {userDtoMaker} = require("../utils/utils.js");


class TestService {
    async getTest() {
        console.log(`Test request!`);
        const {users, totalCount} = await DAL.getAllUsersWithStatistics();
        const usersToSend = users.map(userDtoMaker);
        return {message: `Success`, data: {totalCount, users: usersToSend}};
    }
}

module.exports = new TestService();
const DAL = require("../db/dal.js");

class TopService {
    async getTop(count) {
        const topUsers = await DAL.getTopUsers(count);
        return {message: `Success!`, data: {topUsers}};
    }
}

module.exports = new TopService();
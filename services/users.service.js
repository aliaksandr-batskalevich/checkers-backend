const DAL = require('../db/dal.js');
const {userDtoMaker} = require("../utils/utils.js");
const {ApiError} = require('../exceptions/ApiError.js');

class UsersService {
    async getAllUsers(count = 5, page = 1) {

        const {users, totalCount} = await DAL.getAllUsers(count, page);
        if (page !== 1 && !users.length) {
            throw ApiError.BadRequestError(`No users in this page!`);
        }

        const usersToSend = users.map(userDtoMaker);

        return {message: `Success`, data: {totalCount, users: usersToSend}};
    }

    async getUserById(id) {
        const user = await DAL.getUserById(id);
        if (!user) {
            throw ApiError.BadRequestError(`No users with this ID!`);
        }

        const userToSend = userDtoMaker(user);

        return {message: `Success!`, data: {user: userToSend}};
    }

    async deleteUser(id) {
        const deletedUser = await DAL.deleteUserById(id);
        if (!deletedUser) {
            throw ApiError.BadRequestError(`User whit id: ${id} not found!`);
        }

        return {message: `User ${deletedUser.username} deleted!`};

    }
}

module.exports = new UsersService();
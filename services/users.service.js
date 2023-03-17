import DAL from '../db/dal.js';
import {userDtoMaker} from "../utils/utils.js";
import {ApiError} from '../exceptions/ApiError.js';

class UsersService {
    async getAllUsers() {
        const users = await DAL.getAllUsers();
        const usersToSend = users.map(userDtoMaker);

        return {message: `Success. Found ${users.length} users!`, data: usersToSend};
    }

    async getUserById(id) {
        const user = await DAL.getUserById(id);
        if (!user) {
            throw ApiError.BadRequestError(`No users with this ID!`);
        }

        const userToSend = userDtoMaker(user);

        return {message: `Success!`, data: userToSend};
    }

    async deleteUser(id) {
        const deletedUser = await DAL.deleteUserById(id);
        if (!deletedUser) {
            throw ApiError.BadRequestError(`User whit id: ${id} not found!`);
        }

        return {message: `User ${deletedUser.username} deleted!`};

    }
}

export default new UsersService();
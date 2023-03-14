import DAL from '../db/dal.js';
import {userToSendMaker} from "../utils/utils.js";

class UsersService {
    async getUserById(id) {
        try {
            const user = await DAL.getUserById(id);
            if (!user) {
                return {status: 400, message: `No users with this ID!`, data: null};
            }

            const userToSend = userToSendMaker(user);

            return {
                status: 200,
                message: `Success!`,
                data: userToSend
            };

        } catch (e) {
            return {status: 500, message: `Some server error!`, data: null};
        }
    }

    async getAllUsers() {
        try {
            const users = await DAL.getAllUsers();
            const usersToSend = users.map(userToSendMaker);

            return {
                status: 200,
                message: `Success. Found ${users.length} users!`,
                data: usersToSend
            };

        } catch (e) {
            return {status: 500, message: `Some server error!`, data: null};
        }
    }

    async deleteUser(id) {
        try {
            const deletedUser = await DAL.deleteUserById(id);
            if (!deletedUser) {
                return {status: 400, message: `User whit id: ${id} not found!`}
            }

            return {
                status: 200,
                message: `User ${deletedUser.username} deleted!`
            };

        } catch (e) {
            return {status: 500, message: `Some server error!`, data: null};
        }
    }
}

export default new UsersService();
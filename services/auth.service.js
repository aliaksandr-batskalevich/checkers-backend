import bcrypt from 'bcryptjs';
import DAL from '../db/dal.js';
import config from '../config.js';
import {generateAccessToken} from "../utils/utils.js";


class AuthService {
    async registration(user) {
        try {
            const {username, password} = user;

            const isAvailableUsername = await DAL.checkUsernameIsAvailable(username);
            if (!isAvailableUsername) {
                return {status: 400, message: `Username '${username}' is not available!`};
            }

            const hashPassword = bcrypt.hashSync(password, 7);

            const createdUser = await DAL.registrationUser(username, hashPassword);

            return {status: 200, message: `User ${createdUser.username} registered!`};
        } catch (e) {
            return {status: 500, message: `Some server error!`};
        }
    }

    async login(user) {
        try {
            const {username, password} = user;

            const userFromDb = await DAL.getUserByName(username);
            if (!userFromDb) {
                return {status: 400, message: `User '${username}' not registered!`, token: null};
            }

            const isValidPassword = bcrypt.compareSync(password, userFromDb.password);
            if (!isValidPassword) {
                return {status: 400, message: `Invalid password!`, token: null};
            }

            const token = generateAccessToken(userFromDb.id, config.secretKey, '4h');

            return {status: 200, message: `Success!`, token};

        } catch (e) {
            console.log(e);
            return {status: 500, message: `Some server error!`, token: null};
        }
    }
}


export default new AuthService();
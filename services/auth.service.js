import bcrypt from 'bcryptjs';
import DAL from '../db/dal.js';
import tokenService from './token.service.js';
import {v4} from 'uuid';


class AuthService {
    async registration(user) {
        try {
            const {username, password, email} = user;

            const userByName = await DAL.getUserByName(username);
            if (userByName) {
                return {status: 400, message: `Username '${username}' is not available!`, data: null};
            }

            const userByEmail = await DAL.getUserByEmail(email);
            if (userByEmail) {
                return {status: 400, message: `User with email ${email} already exists.`};
            }

            const hashPassword = bcrypt.hashSync(password, 7);
            const activationLink = v4();

            const createdUser = await DAL.registrationUser(username, hashPassword, email, activationLink);

            const tokens = tokenService.generateTokens({id: createdUser.id});
            const result = await tokenService.refreshToken(createdUser.id, tokens.refreshToken);
            if (result.status !== 200) {
                return {...result, data: null};
            }

            return {
                status: 200,
                message: `User ${createdUser.username} registered! Confirm registration via email: ${createdUser.email}.`,
                data: {tokens}
            };

        } catch (e) {
            return {status: 500, message: `Some server error!`, data: null};
        }
    }

    async login(user) {
        try {
            const {username, password} = user;

            const userFromDb = await DAL.getUserByName(username);
            if (!userFromDb) {
                return {status: 400, message: `User '${username}' not registered!`, data: null};
            }

            const isValidPassword = bcrypt.compareSync(password, userFromDb.password);
            if (!isValidPassword) {
                return {status: 400, message: `Invalid password!`, data: null};
            }

            const tokens = tokenService.generateTokens({id: userFromDb.id});
            const result = await tokenService.refreshToken(userFromDb.id);
            if (result.status < 200 || result.status > 299) {
                return {...result, data: null};
            }

            return {status: 200, message: `Success!`, data: {tokens}};

        } catch (e) {
            console.log(e);
            return {status: 500, message: `Some server error!`, token: null};
        }
    }

    async logout() {

    }
}


export default new AuthService();
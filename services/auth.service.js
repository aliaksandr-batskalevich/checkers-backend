import bcrypt from 'bcryptjs';
import DAL from '../db/dal.js';
import tokenService from './token.service.js';
import {v4} from 'uuid';
import mailService from './mail.service.js';
import {ApiError} from '../exceptions/ApiError.js';


class AuthService {
    async registration(user) {
        const {username, password, email} = user;

        const userByName = await DAL.getUserByName(username);
        if (userByName) {
            throw ApiError.BadRequestError(`Username '${username}' is not available!`);
        }

        const userByEmail = await DAL.getUserByEmail(email);
        if (userByEmail) {
            throw ApiError.BadRequestError(`User with email ${email} already exists.`);
        }

        const hashPassword = bcrypt.hashSync(password, 7);
        const activationLink = v4();

        const createdUser = await DAL.registrationUser(username, hashPassword, email, activationLink);

        const resActivationLink = `${process.env.API_URL}/api/auth/activate/${activationLink}`;
        await mailService.sendActivationMail(email, resActivationLink);

        const tokens = tokenService.generateTokens({id: createdUser.id});
        await tokenService.refreshToken(createdUser.id, tokens.refreshToken);

        return {
            message: `User ${createdUser.username} registered! Confirm registration via email: ${createdUser.email}.`,
            data: {tokens}
        };

    }

    async login(user) {
        const {username, password} = user;

        const userFromDb = await DAL.getUserByName(username);
        if (!userFromDb) {
            throw ApiError.BadRequestError(`User '${username}' not registered!`);
        }

        const isValidPassword = bcrypt.compareSync(password, userFromDb.password);
        if (!isValidPassword) {
            throw ApiError.BadRequestError(`Invalid password!`);
        }

        const tokens = tokenService.generateTokens({id: userFromDb.id});
        await tokenService.refreshToken(userFromDb.id, tokens.refreshToken);

        return {message: `Success!`, data: {tokens}};

    }

    async activateAccount(activationLink) {
        const userFromDb = await DAL.getUserByActivationLink(activationLink);
        if (!userFromDb) {
            throw ApiError.BadRequestError(`Incorrect activation link!`);
        }

        await DAL.activateAccount(activationLink);

    }

    async refreshToken(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }

        // if invalid token (expired or fake) or user not found - generate error!
        const tokenPayload = tokenService.verifyRefreshToken(refreshToken);
        if (!tokenPayload) {
            throw ApiError.UnauthorizedError();
        }
        const {id} = tokenPayload;
        const userById = DAL.getUserById(id);
        if (!userById) {
            throw ApiError.UnauthorizedError();
        }

        // if tokenPayload includes more info - refresh it in new tokenPayload from DB.

        const tokens = tokenService.generateTokens({id});
        await tokenService.refreshToken(id, tokens.refreshToken);

        return {message: `Success!`, data: {tokens}};
    }

    async logout(refreshToken) {
        await tokenService.removeToken(refreshToken);
    }
}


export default new AuthService();
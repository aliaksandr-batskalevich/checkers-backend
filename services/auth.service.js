const bcrypt = require('bcryptjs');
const DAL = require('../db/dal.js');
const tokenService = require('./token.service.js');
const {v4} = require('uuid');
const mailService = require('./mail.service.js');
const {ApiError} = require('../exceptions/ApiError.js');
const {userDtoMaker} = require("../utils/utils.js");


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
        const userDto = userDtoMaker(createdUser);

        const resActivationLink = `${process.env.API_URL}/api/auth/activate/${activationLink}`;
        // await mailService.sendActivationMail(email, resActivationLink);

        const tokens = tokenService.generateTokens({id: createdUser.id});
        await tokenService.refreshToken(createdUser.id, tokens.refreshToken);

        return {
            message: `User ${createdUser.username} registered! Confirm registration via email: ${createdUser.email}.`,
            data: {tokens, user: userDto}
        };

    }

    async login(user) {
        const {username, password} = user;

        const userFromDb = await DAL.getUserByName(username);
        if (!userFromDb) {
            throw ApiError.BadRequestError(`User '${username}' not registered!`);
        }

        const userDto = userDtoMaker(userFromDb);

        const isValidPassword = bcrypt.compareSync(password, userFromDb.password);
        if (!isValidPassword) {
            throw ApiError.BadRequestError(`Invalid password!`);
        }

        const tokens = tokenService.generateTokens({id: userFromDb.id});
        await tokenService.refreshToken(userFromDb.id, tokens.refreshToken);

        return {message: `Success!`, data: {tokens, user: userDto}};

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
        const userById = await DAL.getUserById(id);
        if (!userById) {
            throw ApiError.UnauthorizedError();
        }

        const userDto = userDtoMaker(userById);

        // if tokenPayload includes more info - refresh it in new tokenPayload from DB.

        const tokens = tokenService.generateTokens({id});
        await tokenService.refreshToken(id, tokens.refreshToken);

        return {message: `Success!`, data: {tokens, user: userDto}};
    }

    async logout(refreshToken) {
        await tokenService.removeToken(refreshToken);
    }
}


module.exports = new AuthService();
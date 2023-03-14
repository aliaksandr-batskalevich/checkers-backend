import jwt from 'jsonwebtoken';

export const generateAccessToken = (id, secretKey, expiresIn) => {
    const payload = {id};
    return jwt.sign(payload, secretKey, {expiresIn: expiresIn});
};

export const userToSendMaker = (user) => {
    const {password, ...rest} = user;
    return rest;
};
// const dotenv = require('dotenv');
// const DAL = require("../db/dal.js");

// dotenv.config();
// const adminName = process.env.ADMIN_NAME || 'admin';
// const adminId = +process.env.ADMIN_ID || 10;


const snakeToCamelCase = s => s.split('_').map((w, i) => i ? w.replace(/^[a-z]/, l => l.toUpperCase()) : w).join('');

const objectKeysSnakeToCamelCaseMaker = (object) => {
    const keys = Object.keys(object).map(snakeToCamelCase);
    const values = Object.values(object);

    const camelCaseObject = {};
    keys.forEach((key, index) => {
        camelCaseObject[key] = values[index];
    });

    return camelCaseObject;
};

exports.userDtoMaker = userDtoMaker = (user) => {

    // filter privat properties
    const {password, email, refresh_token, activation_link, ...userDto} = user;

    const camelCaseUserDto = objectKeysSnakeToCamelCaseMaker(userDto);

    return camelCaseUserDto;
};

exports.usersOnlineCreator = (sockets) => {
    const users = sockets.map(socket => ({userId: socket.userId, username: socket.username}));
    const uniqUsers = users.filter((user, index, array) => array.findIndex(u => u.userId === user.userId) === index);
    return uniqUsers;
};

exports.dtoMessageCreator = (messageArr, usersOnlineArr) => {
    const camelCaseMessageArrDto = messageArr.map(objectKeysSnakeToCamelCaseMaker);

    const objectToSend = {
        messages: camelCaseMessageArrDto,
        usersOnline: usersOnlineArr
    };

    return JSON.stringify(objectToSend);
};

// exports.adminMessageCreator = async (message) => {
//     const adminMessageArr = await DAL.addChatMessage(adminName, adminId, message, new Date().toUTCString());
//     return adminMessageArr;
// };

// exports.userMessageCreator = async (username, userId, message) => {
//     const userMessageArr = await DAL.addChatMessage(username, userId, message, new Date().toUTCString());
//     return userMessageArr;
// };
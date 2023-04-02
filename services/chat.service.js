const dotenv = require('dotenv');
const DAL = require("../db/dal.js");

class ChatService {
    adminName;
    adminId;

    constructor() {
        dotenv.config();
        this.adminName = process.env.ADMIN_NAME || 'admin';
        this.adminId = +process.env.ADMIN_ID || 10;
    }

    async adminMessageCreator(message) {
        const adminMessageArr = await DAL.addChatMessage(this.adminName, this.adminId, message, new Date().toUTCString());
        return adminMessageArr;
    }

    async userMessageCreator(username, userId, message) {
        const userMessageArr = await DAL.addChatMessage(username, userId, message, new Date().toUTCString());
        return userMessageArr;
    }
}

module.exports = new ChatService();
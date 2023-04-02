const dotenv = require('dotenv');
const DAL = require("../db/dal.js");
const tokenService = require("./token.service.js");
const {v4} = require("uuid");
const {usersOnlineCreator, dtoMessageCreator} = require("../utils/utils.js");

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

    async onMessage(ws) {
        return async (message) => {
            let newMessageArr;
            const {type, data} = JSON.parse(message);

            switch (type) {
                case 'auth': {
                    const tokenPayload = tokenService.verifyAccessToken(data.accessToken);
                    if (!tokenPayload) {
                        ws.close();
                    }
                    const userFromDB = await DAL.getUserById(tokenPayload.id);
                    if (!userFromDB) {
                        ws.close();
                    }

                    const {id, username} = userFromDB;
                    ws.id = v4();
                    ws.userId = id;
                    ws.username = username;

                    // send last 50 messages from DB
                    const lastMessagesArr = await DAL.getLastMessages(50);
                    const usersOnlineArr = usersOnlineCreator(this.sockets);
                    const chatObject = dtoMessageCreator(lastMessagesArr, usersOnlineArr);
                    ws.send(chatObject);

                    if (!this.sockets.find(socket => socket.userId === ws.userId)) {
                        // create admin message JOINED
                        newMessageArr = await this.adminMessageCreator(`${username} joined!`)
                    }

                    this.sockets.push(ws);

                    break;
                }
                case 'chat': {
                    if (!ws.id) {
                        ws.close();
                    }

                    newMessageArr = await this.userMessageCreator(ws.username, ws.userId, data.message);
                    break;
                }
                case 'ping':
                    break;
            }

            // SEND MESSAGE TO USERS
            if (newMessageArr && this.sockets.length) {
                const usersOnline = usersOnlineCreator(this.sockets);
                const dtoMessage = dtoMessageCreator(newMessageArr, usersOnline);

                this.sockets.forEach(ws => {
                    ws.send(dtoMessage);
                });
            }
        }
    }

    async onClose(ws) {
        return async () => {
            // REMOVE SOCKET
            this.sockets = this.sockets.filter(socket => socket.id !== ws.id);

            // CREATE MESSAGE IF NO USERS SOCKET IN SOCKETS ARRAY
            if (!this.sockets.find(socket => socket.userId === ws.userId)) {
                const adminMessageArr = await this.adminMessageCreator(`${ws.username} left the chat!`);

                // SEND MESSAGE TO USERS
                if (this.sockets.length) {
                    const usersOnlineArr = usersOnlineCreator(this.sockets);
                    const chatObject = dtoMessageCreator(adminMessageArr, usersOnlineArr);

                    this.sockets.forEach(ws => {
                        ws.send(chatObject);
                    });
                }
            }
        }
    }
}

module.exports = new ChatService();
const DAL = require("../db/dal.js");
const chatService = require('../services/chat.service.js');
const tokenService = require("../services/token.service.js");
const {v4} = require("uuid");
const {usersOnlineCreator, dtoMessageCreator} = require("../utils/utils.js");


class ChatController {
    sockets;

    constructor() {
        this.sockets = [];
    }

    connection = async (ws, req) => {
        try {

            ws.on('message', async (message) => {
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
                            newMessageArr = await chatService.createAdminMessage(`${username} joined!`);
                        }

                        this.sockets.push(ws);

                        break;
                    }
                    case 'chat': {
                        if (!ws.id) {
                            ws.close();
                        }

                        newMessageArr = await chatService.createUserMessage(ws.username, ws.userId, data.message);
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
            });

            ws.on('close', async () => {
                // UNAUTHORIZED USERS
                if (!ws.id) return;

                // REMOVE SOCKET
                this.sockets = this.sockets.filter(socket => socket.id !== ws.id);

                // CREATE MESSAGE IF NO USERS SOCKET IN SOCKETS ARRAY
                if (!this.sockets.find(socket => socket.userId === ws.userId)) {
                    const adminMessageArr = await chatService.createAdminMessage(`${ws.username} left the chat!`);

                    // SEND MESSAGE TO USERS
                    if (this.sockets.length) {
                        const usersOnlineArr = usersOnlineCreator(this.sockets);
                        const chatObject = dtoMessageCreator(adminMessageArr, usersOnlineArr);

                        this.sockets.forEach(ws => {
                            ws.send(chatObject);
                        });
                    }
                }
            });

        } catch (e) {
            console.log(e.message);
            ws.close();
        }
    }
}

module.exports = new ChatController();
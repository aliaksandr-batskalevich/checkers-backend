const chatService = require('../services/chat.service.js');
const tokenService = require('../services/token.service.js');
const DAL = require('../db/dal.js')
const {ApiError} = require('../exceptions/ApiError.js');
const {dtoMessageMaker, usersOnlineCreator} = require('../utils/utils.js');
const {v4} = require('uuid');

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
                        const usersOnline = usersOnlineCreator(this.sockets);
                        const lastMessagesDto = dtoMessageMaker(lastMessagesArr, usersOnline);

                        ws.send(lastMessagesDto);

                        if (!this.sockets.find(socket => socket.userId === ws.userId)) {
                            // create admin message JOINED
                            newMessageArr = await DAL.addChatMessage('admin', 10, `${username} joined!`, new Date().toUTCString());
                        }

                        this.sockets.push(ws);

                        break;
                    }
                    case 'chat': {
                        if (!ws.id) {
                            ws.close();
                        }

                        newMessageArr = await DAL.addChatMessage(ws.username, ws.userId, data.message, new Date().toUTCString());
                        break;
                    }
                    case 'ping':
                        break;
                }


                // SEND MESSAGE TO USERS
                if (newMessageArr && this.sockets.length) {
                    const usersOnline = usersOnlineCreator(this.sockets);
                    const dtoMessage = dtoMessageMaker(newMessageArr, usersOnline);
                    this.sockets.forEach(ws => {
                        ws.send(dtoMessage);
                    });
                }
            });

            ws.on('close', async () => {
                this.sockets = this.sockets.filter(socket => socket.id !== ws.id);

                if (!this.sockets.find(socket => socket.userId === ws.userId)) {
                    const createdMessageArr = await DAL.addChatMessage('admin', 10, `${ws.username} left the chat!`, new Date().toUTCString());

                    // SEND MESSAGE TO USERS
                    if (this.sockets.length) {
                        const usersOnline = usersOnlineCreator(this.sockets);
                        const newMessageArr = dtoMessageMaker(createdMessageArr, usersOnline);
                        this.sockets.forEach(ws => {
                            ws.send(newMessageArr);
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
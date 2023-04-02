const chatService = require('../services/chat.service.js');
const tokenService = require('../services/token.service.js');
const DAL = require('../db/dal.js')
const {ApiError} = require('../exceptions/ApiError.js');
const {dtoMessageMaker} = require('../utils/utils.js');
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

                        this.sockets.push(ws);

                        // send last 50 messages from DB
                        const lastMessagesArr = await DAL.getLastMessages(50);
                        const lastMessagesDto = dtoMessageMaker(lastMessagesArr);
                        ws.send(lastMessagesDto);

                        newMessageArr = await DAL.addChatMessage('admin', 10, `${username} joined!`, new Date().toUTCString());

                        if (true) {

                            console.log(1, this.sockets.includes(ws));
                            console.log(2, this.sockets.find(socket => socket.userId === ws.userId));
                            console.log(2, this.sockets.findIndex(socket => socket.userId === ws.userId));
                            // create admin message JOINED
                            // newMessageArr = await DAL.addChatMessage('admin', 10, `${username} joined!`, new Date().toUTCString());
                        }

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

                console.log(newMessageArr);

                if (newMessageArr) {
                    const dtoMessage = dtoMessageMaker(newMessageArr);
                    this.sockets.forEach(ws => {
                        console.log(`sending ${ws.username}`);
                        ws.send(dtoMessage);
                    });
                }
            });

            ws.on('close', async () => {
                this.sockets = this.sockets.filter(socket => socket.id !== ws.id);

                if (!this.sockets.find(socket => socket.userId === ws.userId)) {
                    const createdMessageArr = await DAL.addChatMessage('admin', 10, `${ws.username} left the chat!`, new Date().toUTCString());
                    const newMessageArr = dtoMessageMaker(createdMessageArr);

                    this.sockets.forEach(ws => {
                        ws.send(newMessageArr);
                    });
                }
            });

        } catch (e) {
            console.log(e.message);
            ws.close();
        }
    }
}

module.exports = new ChatController();
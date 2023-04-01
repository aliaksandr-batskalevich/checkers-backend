const chatService = require('../services/chat.service.js');
const tokenService = require('../services/token.service.js');
const DAL = require('../db/dal.js')
const {ApiError} = require('../exceptions/ApiError.js');
const {dtoMessageMaker} = require('../utils/utils.js');

class ChatController {
    sockets;

    constructor() {
        this.sockets = [];
    }

    connection = async (ws, req) => {
        try {
            let newMessage;

            ws.on('message', async (message) => {
                const {type, data} = JSON.parse(message);
                switch (type) {
                    case 'auth': {
                        const tokenPayload = tokenService.verifyAccessToken(data.accessToken);
                        if (!tokenPayload) {
                            // throw ApiError.UnauthorizedError();
                        }
                        const userFromDB = await DAL.getUserById(tokenPayload.id);
                        if (!userFromDB) {
                            // throw ApiError.UnauthorizedError();
                        }

                        const {id, username} = userFromDB;
                        ws.id = id;
                        ws.username = username;
                        this.sockets.push(ws);

                        // create admin message JOINED
                        const createdMessage = await DAL.addChatMessage('admin', 10, `${username} joined!`, new Date().toUTCString());

                        // send last 30 messages from DB
                        const lastMessages = await DAL.getLastMessages(30);

                        newMessage = dtoMessageMaker(lastMessages);
                        break;
                    }
                    case 'chat': {
                        if (!ws.id) {
                            // throw ApiError.UnauthorizedError();
                        }

                        const createdMessageArr = await DAL.addChatMessage(ws.username, ws.id, data.message, new Date().toUTCString());

                        newMessage = dtoMessageMaker(createdMessageArr);
                        break;
                    }
                }

                this.sockets.forEach(ws => {
                    ws.send(newMessage);
                });
            });

            ws.on('close', async () => {
                const createdMessageArr = await DAL.addChatMessage('admin', 10, `${ws.username} left the chat!`, new Date().toUTCString());
                newMessage = dtoMessageMaker(createdMessageArr);

                this.sockets = this.sockets.filter(socket => socket.id !== ws.id);

                this.sockets.forEach(ws => {
                    ws.send(newMessage);
                });
            });

        } catch (e) {
            console.log(e.message);
            // const message = e instanceof ApiError
            //     ? dtoMessageMaker('admin', e.message, new Date().toLocaleTimeString())
            //     : dtoMessageMaker('admin', 'Some server error. Try later!', new Date().toLocaleTimeString());
            // ws.send(message);
            // ws.close();
        }
    }
}

module.exports = new ChatController();
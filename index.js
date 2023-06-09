const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const logMiddleware = require('./middlewares/log.middleware.js');
const errorsMiddleware = require("./middlewares/errors.middleware.js");

const authRouter = require('./routers/auth.router.js');
const usersRouter = require('./routers/users.router.js');
const statusRouter = require('./routers/status.router.js');
const topRouter = require('./routers/top.router.js');
const followRouter = require('./routers/follow.router.js');
const gamesRouter = require('./routers/games.router.js');

const testRouter = require('./routers/test.router.js');
const testUsersRouter = require('./routers/testUsers.router.js');
const testFollowRouter = require('./routers/testfollow.router.js');

const chatController = require('./controllers/chat.controller.js');

dotenv.config();

const PORT = process.env.PORT || 8080;

const app = express();

const WSServer = require('express-ws')(app);

app.ws('/api/chat', chatController.connection);

app.use(express.json());

const options = {
    credentials: true,
    origin: [/^(.*)/],
    // methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
    // allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization',  'Cookie'],
    // exposedHeaders: ['Set-Cookie'],
};

app.use(cors(options));

app.use(cookieParser());

app.use(logMiddleware);

// endpoints
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/status', statusRouter);
app.use('/api/follow', followRouter);
app.use('/api/top', topRouter);
app.use('/api/games', gamesRouter);

// endpoint for test-task EA
app.use('/api/test', testRouter);

// endpoints for test-task Gavrysh
app.use('/api/simple-offline/users', testUsersRouter);
app.use('/api/simple-offline/follow', testFollowRouter);

// errorsMiddleware
app.use(errorsMiddleware);


app.listen(PORT, () => console.log(`Server started on port ${PORT}.`));

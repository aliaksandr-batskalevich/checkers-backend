const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const logMiddleware = require('./middlewares/log.middleware.js');
const testRouter = require('./routers/test.router.js');
const authRouter = require('./routers/auth.router.js');
const usersRouter = require('./routers/users.router.js');
const topRouter = require('./routers/top.router.js');
const chatController = require('./controllers/chat.controller');
const errorsMiddleware = require("./middlewares/errors.middleware.js");
const cors = require('cors');

dotenv.config();


const PORT = process.env.PORT || 8080;

const app = express();

const WSServer = require('express-ws')(app);

app.ws('/api/chat', chatController.connection);

app.use(express.json());

const options = {
    credentials: true,
    origin: [/^(.*)/],
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
    allowedHeaders: ['Authorization'],
    // headers: '*',
};

app.use(cors(options));

app.use(cookieParser());

app.use(logMiddleware);

// endpoints
app.use('/api/test', testRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/top', topRouter);

// errorsMiddleware
app.use(errorsMiddleware);


app.listen(PORT, () => console.log(`Server started on port ${PORT}.`));

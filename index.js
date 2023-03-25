const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const logMiddleware = require('./middlewares/log.middleware.js');
const testRouter = require('./routers/test.router.js');
const authRouter = require('./routers/auth.router.js');
const usersRouter = require('./routers/users.router.js');
const errorsMiddleware = require("./middlewares/errors.middleware.js");
const cors = require('cors');

dotenv.config();


const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.json());
app.use(cors({
    credentials: true,
    origin: [
        'https://aliaksandr-batskalevich.github.io',
        // process.env.CLIENT_URL // localhost:3000
    ],
}));
app.use(cookieParser());

app.use(logMiddleware);

// endpoints
app.use('/api/test', testRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);

// errorsMiddleware
app.use(errorsMiddleware);


app.listen(PORT, () => console.log(`Server started on port ${PORT}.`));

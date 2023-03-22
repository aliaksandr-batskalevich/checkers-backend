const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
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
    origin: process.env.CLIENT_URL
}));
app.use(cookieParser());

// endpoints
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);

// errorsMiddleware
app.use(errorsMiddleware);


app.listen(PORT, () => console.log(`Server started on port ${PORT}.`));

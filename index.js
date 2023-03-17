import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRouter from './routers/auth.router.js';
import usersRouter from './routers/users.router.js';
import errorsMiddleware from "./middlewares/errors.middleware.js";

dotenv.config();

const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.json());
app.use(cookieParser());

// endpoints
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);

// errorsMiddleware
app.use(errorsMiddleware);


app.listen(PORT, () => console.log(`Server started on port ${PORT}.`));
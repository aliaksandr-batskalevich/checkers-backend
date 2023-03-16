import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRouter from './routers/auth.router.js';
import usersRouter from './routers/users.router.js';

dotenv.config();

const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors);

// endpoints
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);

// errorsMiddleware



app.listen(PORT, () => console.log(`Server started on port ${PORT}.`));
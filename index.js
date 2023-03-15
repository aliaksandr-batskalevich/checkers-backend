import express from 'express';
import dotenv from 'dotenv';
import authRouter from './routers/auth.router.js';
import usersRouter from './routers/users.router.js';

dotenv.config();

const PORT = process.env.PORT || 8080;

const app = express();

// for parse JSON from req.body
app.use(express.json());

// endpoints
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);


app.listen(PORT, () => console.log(`Server started on port ${PORT}.`));
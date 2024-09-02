import path from 'path';

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import passport from 'passport';
import axios from 'axios';
import { createServer } from 'http';
import { Server as SocketIO } from 'socket.io';
import cookieParser from 'cookie-parser';

import connectDB from './config/connectDB.js';
import authRoutes from './routes/usersRoute.js';
import chatRoutes from './routes/chatRoute.js';
import Chat from './models/ChatModel.js';
import { app, server } from './socket/socket.js';

// const app = express();

app.use(
    cors({
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        credentials: true,
    }),
);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.use('/api/v1/users', authRoutes);
app.use('/api/v1/chat', chatRoutes);

const port = process.env.PORT || 4001;

const startServer = async () => {
    try {
        connectDB(process.env.MONGO_URI);
        server.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });

        app.get('/', (req, res) => {
            res.send('Socket.IO server running');
        });
    } catch (error) {
        console.log(error);
    }
};

startServer();

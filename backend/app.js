import path from 'path';

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import passport from 'passport';

import { createServer } from 'http';
import { Server as SocketIO } from 'socket.io';
import cookieParser from 'cookie-parser';

import connectDB from './config/connectDB.js';
import authRoutes from './routes/usersRoute.js';
import chatRoutes from './routes/chatRoute.js';

const app = express();

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

app.use('/api/v1/users', authRoutes);
app.use('/api/v1/chat', chatRoutes);

const port = process.env.PORT || 4001;

let httpServer;

const startServer = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        httpServer = createServer(app);

        httpServer.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
        const io = new SocketIO(httpServer, {
            cors: {
                origin: 'http://localhost:3000',
                credentials: true,
                methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
            },
        });

        app.get('/', (req, res) => {
            res.send('Socket.IO server running');
        });

        global.io = io;
        global.onlineUsers = new Map();

        io.on('connection', (socket) => {
            global.chatSocket = socket;

            console.log(`a user connected ${socket.id}`);

            socket.on('add-user', (userId) => {
                global.onlineUsers.set(userId, socket.id);
            });
            socket.on('send-msg', (data) => {
                const sendUserSocket = global.onlineUsers.get(data.to);
                if (sendUserSocket) {
                    socket.to(sendUserSocket).emit('msg-recieve', data.msg);
                }
            });

            socket.on('disconnect', () => {
                console.log('Client disconnected');
            });
        });
    } catch (error) {
        console.error('Error starting the server:', error);
    }
};

startServer();

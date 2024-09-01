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

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.use('/api/v1/users', authRoutes);
app.use('/api/v1/chat', chatRoutes);

const port = process.env.PORT || 4001;

let httpServer;
const fallbackQuotes = [
    'The only way to do great work is to love what you do.',
    'Innovation distinguishes between a leader and a follower.',
    'Stay hungry, stay foolish.',
    'The future belongs to those who believe in the beauty of their dreams.',
    'Success is not final, failure is not fatal: it is the courage to continue that counts.',
];

const startServer = async () => {
    try {
        connectDB(process.env.MONGO_URI);
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

            socket.on('joinChat', async (chatId) => {
                const chat = await Chat.findById(chatId);
                if (chat) {
                    socket.join(chatId);
                    socket.emit('chatHistory', chat.messages);
                }
            });

            socket.on('sendMessage', async ({ chatId, message }) => {
                const chat = await Chat.findById(chatId);
                if (chat) {
                    chat.messages.push({ text: message, sender: 'user' });
                    await chat.save();
                    io.to(chatId).emit('receiveMessage', {
                        text: message,
                        sender: 'user',
                    });

                    setTimeout(async () => {
                        try {
                            const response = await axios.get(
                                'https://api.quotable.io/random',
                                { timeout: 5000 },
                            );
                            const quote = response.data.content;
                            chat.messages.push({ text: quote, sender: 'bot' });
                            await chat.save();
                            io.to(chatId).emit('receiveMessage', {
                                text: quote,
                                sender: 'bot',
                            });
                        } catch (error) {
                            console.error(
                                'Error fetching quote:',
                                error.message,
                            );
                            const fallbackQuote =
                                fallbackQuotes[
                                    Math.floor(
                                        Math.random() * fallbackQuotes.length,
                                    )
                                ];
                            chat.messages.push({
                                text: fallbackQuote,
                                sender: 'bot',
                            });
                            await chat.save();
                            io.to(chatId).emit('receiveMessage', {
                                text: fallbackQuote,
                                sender: 'bot',
                            });
                        }
                    }, 3000);
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

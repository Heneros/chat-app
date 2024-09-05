import { Server } from 'socket.io';
import http from 'http';
import express from 'express';
import axios from 'axios';

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:3000'],
        methods: ['GET', 'POST'],
    },
});
const userSocketMap = {};

export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
};

io.on('connection', async (socket) => {
    console.log('user connected', socket.id);

    const objectSocketHandShake = socket.handshake;
    // console.log(objectSocketHandShake);

    const userId = socket.handshake.query.userId;

    if (userId !== 'undefiend') userSocketMap[userId] = socket.id;

    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    socket.on('join_room', (roomId) => {
        console.log(`User joined room: ${roomId}`);

        socket.join(roomId);
    });

    socket.on('sendMessage', async (data) => {
        const { chatId, message } = data;

        ///   io.to(chatId).emit('receiveMessage', { message, sender: 'user' });
        try {
            const response = await axios.get('https://api.quotable.io/random');
            const apiMessage = response.data.content;
            io.to(chatId).emit('receiveMessage', {
                message: apiMessage,
                sender: 'api',
            });
        } catch (error) {
            console.error('API request failed:', error);
        }
        // console.log('room', response.data.content);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected', socket.id);

        delete userSocketMap[userId];

        io.emit('getOnlineUsers', Object.keys(userSocketMap));
    });
});

export { app, io, server };

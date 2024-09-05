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

io.on('connection', (socket) => {
    console.log('user connected', socket.id);

    const objectSocketHandShake = socket.handshake;
    // console.log(objectSocketHandShake);

    const userId = socket.handshake.query.userId;

    if (userId !== 'undefiend') userSocketMap[userId] = socket.id;

    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    socket.on('join_room', (data) => {
        socket.join(data);
    });

    socket.on('sendMessage', (data) => {
        socket.to(data.room).emit('receiveMessage', data);
        console.log('room', data);
    });

    socket.on('receiveMessage', (data) => {
        console.log('receiveMessage', data);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected', socket.id);

        delete userSocketMap[userId];

        io.emit('getOnlineUsers', Object.keys(userSocketMap));
    });
});

export { app, io, server };

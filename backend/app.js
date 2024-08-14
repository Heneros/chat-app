import path from 'path';

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import passport from 'passport';
import http from 'http';
// import { socketIo } from 'socket.io';
import { Server as SocketIO } from 'socket.io';

import connectDB from './config/connectDB.js';

const app = express();

const server = http.createServer(app);

const io = new SocketIO(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const MONGO_URI = process.env.MONGO_URI;
const port = process.env.PORT || 4001;

const start = async () => {
    try {
        app.listen(port, console.log(`Working on ${port} port`));
        await connectDB(MONGO_URI);
    } catch (error) {
        console.log(`Error ${error}`);
    }
};

start();

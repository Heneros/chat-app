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

app.use(
    cors({
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        credentials: true,
    }),
);

app.use(express.json());

const server = http.createServer(app);

const io = new SocketIO(server, {
    cors: {
        origin: 'http://localhost:3000',
        serveClient: false,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    },
});
app.get('/', (req, res) => {
    res.send('Socket.IO server running');
});

io.on('connection', (socket) => {
    console.log(`a user connected ${socket.id}`);

    socket.on('send_message', (data) => {
        io.emit('receive_message', data);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const MONGO_URI = process.env.MONGO_URI;
const port = process.env.PORT || 4001;

const start = async () => {
    try {
        server.listen(port, console.log(`Working on ${port} port`));
        await connectDB(MONGO_URI);
    } catch (error) {
        console.log(`Error ${error}`);
    }
};

start();

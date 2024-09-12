import path from 'path';

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import { Request, Response, NextFunction } from 'express';

import connectDB from './config/connectDB';
import authRoutes from './routes/usersRoute';
import chatRoutes from './routes/chatRoute';
import Chat from './models/ChatModel';
import { app, server } from './socket/socket';


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

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(error.stack);
    res.status(500).send('Something broke!');
});

app.use('/api/v1/users', authRoutes);
app.use('/api/v1/chat', chatRoutes);

const port = process.env.PORT || 4001;

const MONGO_URI = process.env.MONGO_URI


const startServer = async () => {
    try {
        if(MONGO_URI){
            connectDB(MONGO_URI);
        }
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

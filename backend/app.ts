import path from 'path';

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';

import { Request, Response, NextFunction } from 'express';

import connectDB from './config/connectDB';
import authRoutes from './routes/usersRoute';
import chatRoutes from './routes/chatRoute';
import { app, server } from './socket/socket';
import morgan from 'morgan';
import { systemLogs } from './utils/Logger';
import { errorHandler, notFound } from './middleware/errorMiddleware';
import { apiLimiter } from './middleware/apiLimiter';

app.use(
    cors({
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        credentials: true,
    }),
);

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('combined'));
}

app.use(express.json());
app.use(cookieParser());
app.use(mongoSanitize());

app.use(express.urlencoded({ extended: true }));

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(error.stack);
    res.status(500).send('Something broke!');
});

app.use('/api/v1/users', apiLimiter, authRoutes);
app.use('/api/v1/chat', chatRoutes);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 4001;
const MONGO_URI = process.env.MONGO_URI;

const startServer = async () => {
    try {
        if (MONGO_URI) {
            connectDB(MONGO_URI);
        }
        server.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });

        app.get('/', (req, res: Response) => {
            res.send('Socket.IO server running');
        });
        systemLogs.info(
            `Server on ${port} running. NodeENV: ${process.env.NODE_ENV}  `,
        );
    } catch (error) {
        console.log(error);
    }
};

startServer();

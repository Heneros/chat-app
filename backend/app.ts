import 'dotenv/config';
import express, { Response } from 'express';
import path from 'path';
import cors from 'cors';

import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import session from 'express-session';
import morgan from 'morgan';
import passport from 'passport';

import googleAuth from './config/passport';
import connectDB from './config/connectDB';
import authRoutes from './routes/usersRoute';
import chatRoutes from './routes/chatRoute';
import { systemLogs } from './utils/Logger';
import { errorHandler, notFound } from './middleware/errorMiddleware';
import { apiLimiter } from './middleware/apiLimiter';
import { app, server } from './socket/socket';

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    }),
);

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('tiny'));
}

app.use(express.json());
app.use(
    session({
        secret: process.env.SESSION_SECRET!,
        resave: false,
        saveUninitialized: false,
        cookie: { secure: process.env.NODE_ENV !== 'development' },
        // cookie: {
        //     sameSite: 'none',
        //     secure: false,
        // },
    }),
);

app.use(passport.initialize());
googleAuth();

// app.use(passport.session());

app.use('/api/v1/users', apiLimiter, authRoutes);
app.use('/api/v1/chat', chatRoutes);

app.use(cookieParser());
app.use(mongoSanitize());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 4001;
const MONGO_URI = process.env.MONGO_URI;

if (process.env.NODE_ENV === 'production') {
    const frontendPath = path.join(__dirname, '..', '..', 'dist', 'frontend');

    app.use(express.static(frontendPath));
    app.get('*', (req, res) => {
        res.sendFile(path.join(frontendPath, 'index.html'));
    });
    // app.use(express.static(path.join(__dirname, 'dist/frontend')));
    // app.get('*', (req, res) =>
    //     res.sendFile(path.resolve(__dirname, 'index.html')),
    // );
} else {
    app.get('/', (req, res: Response) => {
        res.send('Socket.IO server running');
    });
}

app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
    try {
        if (MONGO_URI) {
            connectDB(MONGO_URI);
        }
        systemLogs.info(
            `Server on ${port} running. NodeENV: ${process.env.NODE_ENV}  `,
        );

        console.log(
            `Server on ${port} running. Node env: ${process.env.NODE_ENV}  `,
        );
    } catch (error) {
        console.log(error);
    }
};

if (require.main === module) {
    server.listen(port, () => {
        console.log(`Server is running on port ${port}`);
        startServer();
    });
}

export { app, server, startServer };

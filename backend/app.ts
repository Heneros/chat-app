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

// app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
//     console.error(error.stack);
//     res.status(500).send('Something broke!');
// });

app.use('/api/v1/users', authRoutes);
app.use('/api/v1/chat', chatRoutes);

app.use(cookieParser());
app.use(mongoSanitize());
app.use(express.urlencoded({ extended: true }));

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 4001;
const MONGO_URI = process.env.MONGO_URI;

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'frontend/dist')));
    app.get('*', (req, res) =>
        res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html')),
    );
} else {
    app.get('/', (req, res: Response) => {
        res.send('Socket.IO server running');
    });
}
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

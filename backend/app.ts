import 'dotenv/config';
import express, { Response } from 'express';

import cors from 'cors';
// import passport from 'passport';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';

import morgan from 'morgan';
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
    }),
);

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('tiny'));
}

app.use(express.json());
app.use(cookieParser());
app.use(mongoSanitize());

app.use(express.urlencoded({ extended: true }));

// app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
//     console.error(error.stack);
//     res.status(500).send('Something broke!');
// });

app.use('/api/v1/users', apiLimiter, authRoutes);
app.use('/api/v1/chat', chatRoutes);

app.get('/', (req, res: Response) => {
    res.send('Socket.IO server running');
});
app.use(notFound);
app.use(errorHandler);

// sendAutomatedMessages();

const port = process.env.PORT || 4001;
const MONGO_URI = process.env.MONGO_URI;

// server.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });
const startServer = async () => {
    try {
        if (MONGO_URI) {
            connectDB(MONGO_URI);
        }
        // app.get('/', (req, res: Response) => {
        //     res.send('Socket.IO server running');
        // });
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

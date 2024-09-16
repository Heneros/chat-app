import rateLimit from 'express-rate-limit';
import { NextFunction, Request, Response } from 'express';

import { systemLogs } from '../utils/Logger';

export const apiLimiter = rateLimit({
    windowMs: 15 * 600 * 1000,
    max: 100,
    message: {
        message: 'Too many requests from this IP address',
    },
    handler: (req, res, next, options) => {
        systemLogs.error(
            `Too many requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
        );
        res.status(options.statusCode).send(options.message);
    },
});

export const loginLimiter = rateLimit({
    windowMs: 30 * 60 * 1000,
    max: 25,
    message: {
        message:
            'Too many login attempts from this IP address, please try again after 30 minutes',
    },
    handler: (req: Request, res: Response, next: NextFunction) => {
        systemLogs.error(
            `Too many requests: ${req.method} ${req.url} from ${req.headers.origin}`,
        );
        res.status(429).json({
            message:
                'Too many login attempts from this IP address, please try again after 30 minutes',
        });
    },
    standardHeaders: true,
    legacyHeaders: false,
});

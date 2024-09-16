import morgan from 'morgan';
import { Request, Response } from 'express';
import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';

const { combine, timestamp, prettyPrint } = format;

const fileRotateTransport = new transports.DailyRotateFile({
    filename: 'logs/combined-%DATE%.log',
    datePattern: 'YYY-MM-DD',
    maxFiles: '14d',
});

export const systemLogs = createLogger({
    level: 'http',
    format: combine(
        timestamp({
            format: 'YYYY-MM-DD hh:mm:ss.SSS A',
        }),
        prettyPrint(),
    ),
    transports: [
        fileRotateTransport,
        new transports.File({
            level: 'error',
            filename: 'logs/error.log',
        }),
    ],
    exceptionHandlers: [
        new transports.File({ filename: 'logs/exception.log' }),
    ],
    rejectionHandlers: [
        new transports.File({ filename: 'logs/rejections.log' }),
    ],
});

export const morganMiddleware = morgan(
    function (tokens, req, res) {
        return JSON.stringify({
            method: tokens.method(req, res) || 'unknown',
            url: tokens.method(req, res) || 'unknown',
            status: Number.parseFloat(tokens.status(req, res) as string) || 0,
            content_length: tokens.res(req, res, 'content-length') || '0',
            response_time:
                Number.parseFloat(
                    tokens['response-time'](req, res) as string,
                ) || '0',
        });
    },
    {
        stream: {
            write: (message) => {
                const data = JSON.parse(message);
                systemLogs.http(`incoming-request`, data);
            },
        },
    },
);

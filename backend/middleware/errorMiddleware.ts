import { NextFunction, Request, Response } from 'express';

const errorHandler = (err: Error, req: Request, res: Response) => {
    const statusCode = req.statusCode ? res.statusCode : 500;

    return res.status(statusCode).json({
        success: false,
        message: (err as Error).message,
        statusCode,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

const notFound = (req: Request, res: Response, next: NextFunction) => {
    const error = new Error(`That route does not exist - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

export { errorHandler, notFound };

import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction, RequestHandler } from 'express';

import User from '../models/UserModel';
import { RequestWithUser } from '../types/RequestWithUser';

const checkAuth: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        let token: string | null = null;

        const authHeader = req.headers.authorization;
        if (authHeader?.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }

        if (!token) {
            token = req.query.token as string;
        }

        if (!token && req.cookies?.token) {
            token = req.cookies.token;
        }

        if (!token) {
            return res.status(401).json({
                message: 'Unauthorized: No valid token found',
            });
        }

        const JWT_ACCESS_SECRET_KEY = process.env.JWT_ACCESS_SECRET_KEY;
        if (!JWT_ACCESS_SECRET_KEY) {
            throw new Error('Server configuration error: Missing JWT secret');
        }

        const decoded = jwt.verify(token, JWT_ACCESS_SECRET_KEY) as {
            id: string;
        };

        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        (req as RequestWithUser).user = user;
        next();
    } catch (error) {
        console.error('Auth error:', error);
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        res.status(403).json({ message: 'Authentication failed' });
    }
};

export default checkAuth;

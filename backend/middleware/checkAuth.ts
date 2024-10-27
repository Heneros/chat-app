import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction, RequestHandler } from 'express';

import User from '../models/UserModel';
import { RequestWithUser } from '../types/RequestWithUser';

const checkAuth: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (typeof authHeader !== 'string' || !authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    // console.log(authHeader);

    const jwtToken = authHeader.split(' ')[1];

    try {
        const JWT_ACCESS_SECRET_KEY = process.env.JWT_ACCESS_SECRET_KEY;
        if (!JWT_ACCESS_SECRET_KEY) {
            throw new Error('No JWT_ACCESS_SECRET_KEY');
        }

        const decoded = jwt.verify(jwtToken, JWT_ACCESS_SECRET_KEY) as {
            id: string;
        };

        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        (req as RequestWithUser).user = user;

        // req.user = user as IUser;
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(403).json({ message: 'Forbidden' });
    }
};

export default checkAuth;

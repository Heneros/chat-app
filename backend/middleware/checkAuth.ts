import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import { Request, Response, NextFunction } from 'express';

import User, { IUser } from '../models/UserModel';

interface CustomRequest extends Request {
    user?: IUser;
}

const checkAuth = asyncHandler(
    async (req: CustomRequest, res: Response, next: NextFunction) => {
        const authHeader =
            req.headers.authorization || req.headers.Authorization;

        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        // console.log(authHeader);

        const jwtToken = authHeader.split(' ')[1];

        try {
            const JWT_ACCESS_SECRET_KEY = process.env.JWT_ACCESS_SECRET_KEY;
            if (!JWT_ACCESS_SECRET_KEY) {
                throw new Error('No JWT_ACCESS_SECRET_KEY');
            }

            const decoded = jwt.verify(jwtToken, JWT_ACCESS_SECRET_KEY);

            req.user = await User.findById(decoded.id).select('-password');
            // console.log('decoded', decoded);

            if (!req.user) {
                return res.status(404).json({ message: 'User not found 3' });
            }
            next();
        } catch (error) {
            console.error('Error verifying token:', error);
            res.status(403).json({ message: 'Forbidden' });
        }
    },
);

export default checkAuth;

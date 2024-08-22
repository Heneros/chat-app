import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/UserModel.js';

const checkAuth = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({
            message: 'Unauthorized: No token provided or invalid format',
        });
    }

    const jwtToken = authHeader.split(' ')[1];

    // Log the token to see if it's malformed
    // console.log('Extracted JWT:', jwtToken);

    try {
        const decoded = jwt.verify(jwtToken, process.env.JWT_ACCESS_SECRET_KEY);
        // console.log('Decoded JWT:', decoded);

        req.user = await User.findById(decoded.id).select('-password');
        if (!req.user) {
            return res.status(404).json({ message: 'User not found' });
        }
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(403).json({ message: 'Forbidden: Invalid token' });
    }
});

export default checkAuth;

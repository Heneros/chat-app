import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';

import User from '../../models/UserModel';

const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({
            message: 'Please provide an email and password',
        });
    }


    const user = await User.findOne({ email });
    // console.log(user);
    let newRefreshToken;
    if (user && (await user.matchPassword(password))) {
        const accessToken = jwt.sign(
            {
                id: user._id,
            },
            process.env.JWT_ACCESS_SECRET_KEY,
            { expiresIn: '30d' },
        );

        newRefreshToken = jwt.sign(
            {
                id: user._id,
            },
            process.env.JWT_REFRESH_SECRET_KEY,
            { expiresIn: '30d' },
        );

        const cookies = req.cookies;

        let newRefreshTokenArray = !cookies?.chat_app
            ? user.refreshToken
            : user.refreshToken.filter((refT) => refT !== cookies?.chat_app);

        if (cookies?.chat_app) {
            const refreshToken = cookies?.chat_app;
            const existingRefreshToken = await User.findOne({
                refreshToken,
            }).exec();

            if (!existingRefreshToken) {
                newRefreshToken = [];
            }

            const options = {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000,
                secure: true,
                // sameSite: 'Lax',
                sameSite:
                    process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
            };
            res.clearCookie('chat_app', options);
        }

        user.refreshToken = [...newRefreshTokenArray, newRefreshToken];

        await user.save();

        const options = {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            // secure: process.env.NODE_ENV === 'production',
            secure: true,
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
        };

        res.cookie('chat_app', newRefreshToken, options);

        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            accessToken,
        });
    } else {
        res.status(401).json({ message: ' Invalid data ' });
    }
});

export default authUser;
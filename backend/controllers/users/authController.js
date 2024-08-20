import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import User from '../../models/UserModel.js';

const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({
            message: 'Please provide an email and password',
        });
    }

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
        if (
            !process.env.JWT_ACCESS_SECRET_KEY &&
            !process.env.JWT_REFRESH_SECRET_KEY
        ) {
            throw new Error('JWT secret keys are not set');
        }
        const accessToken = jwt.sign(
            { id: user._id },
            process.env.JWT_ACCESS_SECRET_KEY,
            { expiresIn: '7d' },
        );

        let newRefreshToken = jwt.sign(
            {
                id: user._id,
            },
            process.env.JWT_REFRESH_SECRET_KEY,
            { expiresIn: '7d' },
        );

        const cookies = req.cookies;

        let newRefreshTokenArray = !cookies?.chat_app
            ? user.refreshToken
            : user.refreshToken.filter((refT) => refT !== cookies.chat_app);

        if (cookies?.chat_app) {
            const refreshToken = cookies.chat_app;
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
                sameSite: 'None',
            };
            res.clearCookie('chat_app', options);
        }

        user.refreshToken = [...newRefreshTokenArray, newRefreshToken];

        await user.save();

        const options = {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            secure: true,
            sameSite: 'None',
        };

        res.cookie('chat_app', newRefreshToken, options);

        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            accessToken,
        });
    }
});

export default authUser;

import asyncHandler from 'express-async-handler';

const logoutUser = asyncHandler(async (req, res) => {
    res.cookie('chat_app', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
});

export default logoutUser;

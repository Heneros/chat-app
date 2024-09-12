import asyncHandler from 'express-async-handler';
import Chat from '../../models/ChatModel.js';

const getAll = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    if (!userId) {
        return res.status(401).json({ message: 'Not authorized' });
    }
    const messages = await Chat.find({
        user: userId,
    });

    res.status(200).json({ messages });
});

export default getAll;

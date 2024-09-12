import asyncHandler from 'express-async-handler';
import Chat from '../../models/ChatModel.js';

const { randomBytes } = await import('crypto');

const createChat = asyncHandler(async (req, res) => {
    const { firstName, lastName } = req.body;

    if (!firstName && lastName) {
        res.status(400).json({ message: 'Empty field(s)' });
    }
    const chatId = randomBytes(32).toString('hex');
    const chat = new Chat({ firstName, lastName, user: req.user._id, chatId });
    await chat.save();
    res.status(202).json({ success: true, message: 'Chat created', chat });
});

export default createChat;

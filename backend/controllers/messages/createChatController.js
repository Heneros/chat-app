import asyncHandler from 'express-async-handler';
import Chat from '../../models/ChatModel.js';

const createChat = asyncHandler(async (req, res) => {
    const { firstName, lastName } = req.body;

    if (!firstName && lastName) {
        res.status(400).json({ message: 'Empty field(s)' });
    }
    const chat = new Chat({ firstName, lastName });
    await chat.save();
    res.status(202).json({ success: true, message: 'Chat created', chat });
});

export default createChat;

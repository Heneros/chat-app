import asyncHandler from 'express-async-handler';
import Chat from '../../models/ChatModel.js';

const updateChat = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { firstName, lastName } = req.body;
    const chat = await Chat.findByIdAndUpdate(
        id,
        { firstName, lastName },
        { new: true },
    );

    res.status(200).json({ message: 'Updated', chat });
});

export default updateChat;

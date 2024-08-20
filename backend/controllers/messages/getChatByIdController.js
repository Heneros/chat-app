import asyncHandler from 'express-async-handler';
import Chat from '../../models/ChatModel.js';

const getChatById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const messages = await Chat.findById({ _id: id });

    res.status(200).json({ messages });
});

export default getChatById;

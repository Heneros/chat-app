import asyncHandler from 'express-async-handler';
import { io } from '../../socket/socket';
import Chat from '../../models/ChatModel';

const updateChat = asyncHandler(async (req, res) => {
    const { chatId } = req.params;
    const { firstName, lastName } = req.body;

    const chat = await Chat.findByIdAndUpdate(
        chatId,
        { firstName, lastName },
        { new: true },
    );
    if (!chat) {
        return res.status(404).json({ message: 'Chat not found' });
    }

    io.to(chatId).emit('chatUpdated', chat);

    res.status(200).json({ message: 'Updated', firstName, lastName, chat });
});

export default updateChat;

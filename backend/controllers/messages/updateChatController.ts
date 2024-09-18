import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import { io } from '../../socket/socket';
import Chat from '../../models/ChatModel';
import { systemLogs } from '../../utils/Logger';

const updateChat = async (req: Request, res: Response) => {
    const { chatId } = req.params;
    const { firstName, lastName } = req.body;

    try {
        const chat = await Chat.findByIdAndUpdate(
            chatId,
            { firstName, lastName },
            { new: true },
        );
        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }

        io.to(chatId).emit('chatUpdated', chat);

        res.status(200).json({
            message: 'Updated',
            firstName,
            lastName,
            chat,
        });
    } catch (error) {
        systemLogs.error('Error deleting chat:', error);
        console.error('Error deleting chat:', error);
        res.status(500).json({ message: 'Error deleting chat:' });
    }
};

export default updateChat;

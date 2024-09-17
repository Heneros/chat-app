import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';

import Chat from '../../models/ChatModel';
import { systemLogs } from '../../utils/Logger';

const getChatById = async (req: Request, res: Response) => {
    const { chatId } = req.params;

    if (!chatId) {
        return res.status(400).json({ message: 'Chat ID not provided' });
    }
    // console.log('chatId:', chatId);
    try {
        const chat = await Chat.findById(chatId);

        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }

        res.status(200).json({ messages: chat.messages });
    } catch (error) {
        const err = error as Error;
        systemLogs.error('Error getChatById controller:', error);
        res.status(500).json({
            message: 'Server Error getChatById',
            error: err.message,
        });
    }
};

export default getChatById;

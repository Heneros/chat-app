import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import { systemLogs } from '../../utils/Logger';

import Chat from '../../models/ChatModel';

const deleteChat = async (req: Request, res: Response) => {
    const { chatId } = req.params;
    if (!chatId) {
        return res.status(400).json({ message: 'Chat ID is required' });
    }
    try {
        const chat = await Chat.findByIdAndDelete(chatId);
        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }
        res.status(204).json({ message: 'Chat Deleted' });
    } catch (error) {
        systemLogs.error('Error deleting chat:', error);
        console.error('Error deleting chat:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export default deleteChat;

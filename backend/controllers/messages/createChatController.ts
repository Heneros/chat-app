import { Request, Response, NextFunction } from 'express';
import { RequestWithUser } from '../../types/RequestWithUser';
import Chat from '../../models/ChatModel';

import { CustomRequest } from '../../middleware/checkAuth';

const createChat = async (req: Request, res: Response, next: NextFunction) => {
    const { firstName, lastName } = req.body;
    const { randomBytes } = await import('crypto');

    if (!firstName || !lastName) {
        return res.status(400).json({ message: 'Empty field(s)' });
    }

    const chatId = randomBytes(32).toString('hex');

    const userReq = req as RequestWithUser;

    if (!userReq.user) {
        return res.status(401).json({ message: 'User is undefined' });
    }

    const userId = userReq.user._id;

    try {
        const chat = new Chat({
            firstName,
            lastName,
            user: userId,
            chatId,
        });

        await chat.save();

        res.status(202).json({
            success: true,
            message: 'Chat created',
            chat,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Server Error create chat.',
            error: (error as Error).message,
        });
    }
};

export default createChat;

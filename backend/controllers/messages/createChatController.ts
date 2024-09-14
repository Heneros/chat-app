import asyncHandler from 'express-async-handler';
import { Request, Response, NextFunction } from 'express';

import Chat from '../../models/ChatModel';
import { IUser } from '../../models/UserModel';

interface CustomRequest extends Request {
    user?: IUser;
}

const createChat = asyncHandler(
    async (req: CustomRequest, res: Response, next: NextFunction) => {
        const { firstName, lastName } = req.body;
        const { randomBytes } = await import('crypto');

        if (!firstName && lastName) {
            res.status(400).json({ message: 'Empty field(s)' });
        }
        const chatId = randomBytes(32).toString('hex');

        if (!req.user) {
            return res.status(401).json({ message: 'User is undefiend' });
        }
        const userId = req.user._id;

        const chat = new Chat({ firstName, lastName, user: userId, chatId });
        await chat.save();
        res.status(202).json({ success: true, message: 'Chat created', chat });
    },
);

export default createChat;

import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import Chat from '../../models/ChatModel';
import { IUser } from '../../models/UserModel';

interface CustomRequest extends Request {
    user?: IUser;
}

const getAll = async (req: CustomRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User is undefiend' });
        }

        const userId = req.user._id;

        if (!userId) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        const messages = await Chat.find({
            user: userId,
        });

        res.status(200).json({ messages });
    } catch (error) {
        res.status(500).json({
            message: 'Server Error get all chat .',
            error: (error as Error).message,
        });
    }
};

export default getAll;

// import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import axios from 'axios';
import { Request, Response } from 'express';
import Chat from '../../models/ChatModel';
import { io } from '../../socket/socket';
import { RequestWithUser } from '../../types/RequestWithUser';

const fallbackQuotes = [
    'The only way to do great work is to love what you do.',
    'Innovation distinguishes between a leader and a follower.',
    'Stay hungry, stay foolish.',
    'The future belongs to those who believe in the beauty of their dreams.',
    'Success is not final, failure is not fatal: it is the courage to continue that counts.',
];

const sendMessage = async (req: Request, res: Response) => {
    const { chatId } = req.params;
    const { message } = req.body;

    try {
        const chat = await Chat.findById(chatId);

        if (!chat) {
            res.status(404).send({ message: 'Chat not found' });
            throw new Error('Chat not found');
        }
        const userReq = req as RequestWithUser;

        if (!userReq.user) {
            return res.status(401).json({ message: 'User is undefiend' });
        }
        const userId = userReq.user._id;

        const newMessage = {
            text: message,
            sender: new mongoose.Types.ObjectId(userId),
        };
        chat.messages.push(newMessage);

        await chat.save();

        setTimeout(async () => {
            try {
                await chat.save();
            } catch (error) {
                ///  console.error('Error fetching quote:', error.message);
                const fallbackQuote =
                    fallbackQuotes[
                        Math.floor(Math.random() * fallbackQuotes.length)
                    ];
                const botMessage = {
                    text: fallbackQuote,
                    sender: new mongoose.Types.ObjectId(userId),
                };
                chat.messages.push(botMessage);
                await chat.save();
                io.to(chatId).emit('receiveMessage', botMessage);
            }
        }, 1000);

        res.status(200).json({ chat });
    } catch (error) {
        res.status(500).json({
            message: 'Server Error send message',
            error: (error as Error).message,
        });
    }
};

export { sendMessage };

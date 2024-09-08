import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import Chat from '../../models/ChatModel.js';
import { io } from '../../socket/socket.js';

const fallbackQuotes = [
    'The only way to do great work is to love what you do.',
    'Innovation distinguishes between a leader and a follower.',
    'Stay hungry, stay foolish.',
    'The future belongs to those who believe in the beauty of their dreams.',
    'Success is not final, failure is not fatal: it is the courage to continue that counts.',
];

const sendMessage = asyncHandler(async (req, res) => {
    const { chatId } = req.params;

    const { message } = req.body;
    const chat = await Chat.findById(chatId);

    if (!chat) {
        res.status(404);
        throw new Error('Chat not found');
    }
    const newMessage = {
        text: message,
        sender: new mongoose.Types.ObjectId(req.user._id),
    };
    chat.messages.push(newMessage);

    // chat.messages.push(message);
    await chat.save();

    setTimeout(async () => {
        try {
            await chat.save();
        } catch (error) {
            console.error('Error fetching quote:', error.message);
            const fallbackQuote =
                fallbackQuotes[
                    Math.floor(Math.random() * fallbackQuotes.length)
                ];
            const botMessage = {
                text: fallbackQuote,
                sender: new mongoose.Types.ObjectId(req.user._id),
            };
            chat.messages.push(botMessage);
            await chat.save();
            io.to(chatId).emit('receiveMessage', botMessage);
        }
    }, 1000);

    res.status(200).json({ chat });
});

/// New version

export { sendMessage };

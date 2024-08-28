import asyncHandler from 'express-async-handler';
import axios from 'axios';
import Chat from '../../models/ChatModel.js';

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
    chat.messages.push(message);
    await chat.save();
    global.io.to(chat.chatId).emit('receive_message', message);

    setTimeout(async () => {
        try {
            const response = await axios.get('https://api.quotable.io/random', { timeout: 5000 });
            const quote = response.data.content;
            chat.messages.push(quote);
            await chat.save();
            global.io
                .to(global.onlineUsers.get(chat.chatId))
                .emit('receive_message', quote);
        } catch (error) {
            console.error('Error fetching quote:', error.message);
            const fallbackQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
            chat.messages.push(fallbackQuote);
            await chat.save();
            global.io
                .to(global.onlineUsers.get(chat.chatId))
                .emit('receive_message', fallbackQuote);
        }
    }, 3000);

    res.status(200).json({ chat });
});

export default sendMessage;

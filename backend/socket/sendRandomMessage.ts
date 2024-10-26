import axios from 'axios';
import { Server, Socket } from 'socket.io';
import https from 'https';
import CacheableLookup from 'cacheable-lookup';

import Chat from '../models/ChatModel';
import { io } from './socket';

const fallbackQuotes = [
    'Technology is best when it brings people together.',
    'The only way to do great work is to love what you do.',
    'Innovation distinguishes between a leader and a follower.',
    'The future depends on what you do today.',
];

const agent = new https.Agent({
    rejectUnauthorized: false,
    timeout: 2000,
    keepAlive: true,
});

async function sendAndSaveMessage(chatId: string, message: string) {
    io.to(chatId).emit(`receiveMessage:${chatId}`, {
        text: message,
        sender: 'api',
    });

    try {
        const chat = await Chat.findById(chatId);
        if (chat) {
            const newMessage = {
                text: message,
                sender: 'api',
            };
            chat.messages.push(newMessage);
            await chat.save();
        }
    } catch (error) {
        console.error('Failed to save message to database:', error);
    }
}

export const sendRandomMessage = async (chatId: string) => {
    try {
        const response = await axios.get('https://api.quotable.io/random', {
            httpsAgent: agent,
            timeout: 2000,
        });
        const apiMessage = response.data.content;
        await sendAndSaveMessage(chatId, apiMessage);

        console.log(`Sent message to room: ${chatId}`);
    } catch (error) {
        const fallbackQuote =
            fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
        await sendAndSaveMessage(chatId, fallbackQuote);
    }
};

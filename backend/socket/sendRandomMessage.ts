import axios from 'axios';
import { Server, Socket } from 'socket.io';
import https from 'https';
import dns from 'dns';
import CacheableLookup from 'cacheable-lookup';

import Chat from '../models/ChatModel';
import { io } from './socket';


export const sendRandomMessage = async (chatId: string) => {
    try {
        const { default: CacheableLookup } = await import('cacheable-lookup');
        const cacheable = new CacheableLookup();

        const agent = new https.Agent({
            rejectUnauthorized: false,
            lookup: cacheable.lookup as any, 
        });

        const response = await axios.get('https://api.quotable.io/random', {
            httpsAgent: agent,
        });
        const apiMessage = response.data.content;

        io.to(chatId).emit(`receiveMessage:${chatId}`, {
            text: apiMessage,
            sender: 'api',
        });

        const chat = await Chat.findById(chatId);
        if (chat) {
            const newMessage = {
                text: apiMessage,
                sender: 'api',
            };
            chat.messages.push(newMessage);
            await chat.save();
        }

        console.log(`Sent message to room: ${chatId}`);
    } catch (error) {
        console.error('Failed to send random message:', error);
    }
};

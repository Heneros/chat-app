import axios from 'axios';
import { Server, Socket } from 'socket.io';
import https from 'https';
import Chat from '../models/ChatModel';
import { io } from './socket';

export const sendRandomMessage = async (roomId: string) => {
    try {
        const agent = new https.Agent({
            rejectUnauthorized: false,
        });

        const response = await axios.get('https://api.quotable.io/random', {
            httpsAgent: agent,
        });
        const apiMessage = response.data.content;

        io.to(roomId).emit(`receiveMessage:${roomId}`, {
            text: apiMessage,
            sender: 'api',
        });

        const chat = await Chat.findById(roomId);
        if (chat) {
            const newMessage = {
                text: apiMessage,
                sender: 'api',
            };
            chat.messages.push(newMessage);
            await chat.save();
        }

        console.log(`Sent message to room: ${roomId}`);
    } catch (error) {
        console.error('Failed to send random message:', error);
    }
};

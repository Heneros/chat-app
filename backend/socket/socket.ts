import { Server } from 'socket.io';
import http from 'http';
import express from 'express';
import axios from 'axios';

import Chat from '../models/ChatModel';

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:3000'],
        methods: ['GET', 'POST'],
    },
});

io.on('connection', async (socket) => {
    // console.log('user connected', socket.id);
    socket.on('join_room', (roomId) => {
        console.log(`User joined room: ${roomId}`);
        socket.join(roomId);
    });

    socket.on('leave_room', (chatId) => {
        socket.leave(chatId);
    });
    socket.on('updateChat', async ({ chatId, firstName, lastName }) => {
        try {
            const chat = await Chat.findByIdAndUpdate(
                chatId,
                { firstName, lastName },
                { new: true },
            );

            if (chat) {
                io.to(chatId).emit('chatUpdated', chat);
            }
        } catch (error) {
            console.error('Failed to update chat:', error);
        }
    });
    socket.on('sendMessage', async (data) => {
        const { chatId, text } = data;
        // console.log('roomId', roomId);
        io.to(chatId).emit(`receiveMessage:${chatId}`, {
            text,
            sender: 'user',
        });
        try {
            const response = await axios.get('https://api.quotable.io/random');
            const apiMessage = response.data.content;

            // console.log(apiMessage);
            io.to(chatId).emit(`receiveMessage:${chatId}`, {
                text: apiMessage,
                sender: 'api',
            });

            const chat = await Chat.findById(chatId);
            if (!chat) {
                console.log('chat do not exists');
            }
            const newMessage = {
                text: apiMessage,
                sender: chatId,
            };
            if (chat) {
                chat.messages.push(newMessage);
                await chat.save();
            }
        } catch (error) {
            console.error('API request failed:', error);
        }
    });
});

export { app, io, server };

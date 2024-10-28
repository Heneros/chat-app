import 'dotenv/config';

import { Server } from 'socket.io';
import http from 'http';
import express from 'express';

import Chat from '../models/ChatModel';
import { systemLogs } from '../utils/Logger';
import { sendRandomMessage } from './sendRandomMessage';

import User from '../models/UserModel';
import {
    authenticateUser,
    toggleAutomatedMessages,
} from './socketUsercontroller';
import { sendAutomatedMessages } from './sendAutomatedMessages';

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ['GET', 'POST'],
    },
});

export let activeRooms: string[] = [];
const activeUsers = new Set<string>();

io.on('connection', async (socket) => {
    console.log('User connected:', socket.id);

    socket.on('authenticate', async (userId: string) => {
        try {
            console.log('authenticate:', userId);
            const automatedMesssagesEnabled = await authenticateUser(
                userId,
                socket,
            );
            if (automatedMesssagesEnabled) activeUsers.add(userId);
        } catch (error) {
            console.error('User Authentication Error', error);
            systemLogs.error('User Authentication Error', error);
        }
    });

    socket.on('toggleAutomateMessages', async ({ userId, enabled }) => {
        await toggleAutomatedMessages({ userId, enabled, socket });
        console.log('toggleAutomateMessages');
        if (enabled) activeUsers.add(userId);
        else activeUsers.delete(userId);
        socket.emit('automatedMessagesUpdated', enabled);
    });

    socket.on('join_room', async (data) => {
        /// console.log('Received join_room event:', data);

        const { userId: _id, chatId } = data;
        console.log('Received join_room event:', { _id, chatId });

        if (_id && chatId) {
            const usernameId = await User.findById(_id);
            if (
                !activeRooms.includes(chatId) &&
                usernameId?.automatedMessagesEnabled === true
            ) {
                activeRooms.push(chatId);
                socket.join(chatId);
            }
        } else {
            console.log('join_room error ');
        }
    });

    socket.on('leave_room', (roomId) => {
        socket.leave(roomId);
        // console.log(`User left room: ${roomId}`);
        activeRooms = activeRooms.filter((room) => room !== roomId);
        console.log('Updated activeRooms', activeRooms);
    });

    socket.on('editMessage', async ({ chatId, messageId, newText }) => {
        try {
            const chat = await Chat.findOne({ _id: chatId });

            console.log('chat ', chat);
            if (chat) {
                const message = chat.messages.id(messageId);
                if (message) {
                    message.text = newText;
                    await chat.save();

                    io.to(chatId).emit('messageUpdated', {
                        messageId,
                        newText,
                    });

                    console.log('success chat msg update');
                }
            }
            console.log('chat dont exist');
        } catch (error) {
            console.log('editMessage', error);
        }
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

    socket.on('connect_error', (error) => {
        console.log('connect_error', error);
    });

    socket.on('sendMessage', async (data) => {
        const { chatId, text } = data;

        io.to(chatId).emit(`receiveMessage:${chatId}`, {
            text,
            sender: 'user',
        });

        sendRandomMessage(chatId);
    });
});
const timer = Number(process.env.TIMER);

setInterval(() => sendAutomatedMessages([...activeUsers]), timer);
export { io, app, server };

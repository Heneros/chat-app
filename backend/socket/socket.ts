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

console.log('activeRooms', activeRooms);
io.on('connection', async (socket) => {
    // console.log('User connected:', socket.id);

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

    socket.on('getAutomatedMessagesStatus', async (userId: string) => {
        try {
            const user = await User.findById(userId);
            if (!user) {
                socket.emit('automatedMessagesError', 'User not found');
                return;
            }

            socket.emit(
                'automatedMessagesStatus',
                user.automatedMessagesEnabled,
            );
        } catch (error) {
            console.error('Error getting automated messages status:', error);
            socket.emit('automatedMessagesError', 'Failed to get status');
        }
    });

    socket.on('toggleAutomateMessages', async ({ userId, enabled }) => {
        try {
            console.log(
                `Attempting to toggle automated messages for user ${userId} to ${enabled}`,
            );
            const user = await User.findById(userId);
            if (!user) {
                socket.emit('toggleError', 'User not found');
                return;
            }
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { $set: { automatedMessagesEnabled: enabled } },
                { new: true },
            );
            if (!updatedUser) {
                socket.emit('toggleError', 'Failed to update user settings');
                return;
            }

            if (enabled) {
                activeUsers.add(userId);
            } else {
                activeUsers.delete(userId);
            }
            socket.emit('automatedMessagesStatus', enabled);
            console.log(
                `Automated messages ${enabled ? 'enabled' : 'disabled'} for user ${userId}`,
            );
        } catch (error) {
            console.error('Error toggling automated messages:', error);
            systemLogs.error('Error toggling automated messages:', error);
            socket.emit('toggleError', 'Failed to toggle automated messages');
        }
        await toggleAutomatedMessages({ userId, enabled, socket });
        //  console.log('toggleAutomateMessages');
        if (enabled) activeUsers.add(userId);
        else activeUsers.delete(userId);
        // socket.emit('automatedMessagesUpdated', enabled);
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
                console.log(' join_room success ');
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

            // console.log('chat ', chat);
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

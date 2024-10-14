import { Server } from 'socket.io';
import http from 'http';
import express from 'express';
import axios from 'axios';
import https from 'https';

import Chat from '../models/ChatModel';
import { systemLogs } from '../utils/Logger';
import { sendRandomMessage } from './sendRandomMessage';
import User from '../models/UserModel';

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ['GET', 'POST'],
    },
});

let activeRooms: string[] = [];
const activeUsers = new Set<string>();

io.on('connection', async (socket) => {
    console.log('User connected:', socket.id);

    //  userPreferences.set(socket.id, true);

    socket.on('authenticate', async (userId: string) => {
        try {
            const user = await User.findById(userId);
            if (user) {
                socket.data.userId = userId;
                socket.data.automatedMessagesEnabled =
                    user.automatedMessagesEnabled;
                if (user.automatedMessagesEnabled) {
                    activeUsers.add(userId);
                }
                console.log(
                    `User ${userId} authenticated, automatedMessagesEnabled: ${user.automatedMessagesEnabled}`,
                );
            }
        } catch (error) {
            console.log('Authentication error:', error);
        }
    });

    socket.on('toggleAutomateMessages', async (enabled: boolean) => {
        if (socket.data.userId) {
            try {
                await User.findByIdAndUpdate(socket.data.userId, {
                    automatedMessagesEnabled: enabled,
                });
                socket.data.automatedMessagesEnabled = enabled;
                console.log(
                    `User ${socket.data.userId} ${enabled ? 'enabled' : 'disabled'} automated messages`,
                );

                if (enabled) {
                    activeUsers.add(socket.data.userId);
                } else {
                    activeUsers.delete(socket.data.userId);
                }
            } catch (error) {
                console.error('Failed to update user preferences:', error);
            }
        }
    });

    const availableChats = await Chat.find({})
        .populate({
            path: 'user',
            match: { automatedMessagesEnabled: true },
        })
        .exec();

    const filteredChats = availableChats.filter((chat) => chat.user);
    // console.log(`availableChats: ${filteredChats}`);

    filteredChats.forEach((chat) => {
        socket.join(chat._id.toString());
        if (!activeRooms.includes(chat._id.toString())) {
            activeRooms.push(chat._id.toString());
        }
    });


    socket.on('leave_room', (roomId) => {
        socket.leave(roomId);
        console.log(`User left room: ${roomId}`);
        activeRooms = activeRooms.filter((room) => room !== roomId);
        console.log('Updated activeRooms', activeRooms);
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

        try {
            const agent = new https.Agent({
                rejectUnauthorized: false,
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
            if (!chat) {
                console.log('chat does not exist');
            } else {
                const newMessage = {
                    text: apiMessage,
                    sender: 'api',
                };
                chat.messages.push(newMessage);
                await chat.save();
            }
        } catch (error) {
            console.error('API request failed:', error);
        }
    });
});

async function sendAutomatedMessages() {
    if (activeRooms.length > 0) {
        activeUsers.forEach(async (userId) => {
            const randomRoomId =
                activeRooms[Math.floor(Math.random() * activeRooms.length)];
            if (randomRoomId) {
                await sendRandomMessage(randomRoomId);
            }
        });
    }
}

setInterval(sendAutomatedMessages, 2500);

export { io, app, server };

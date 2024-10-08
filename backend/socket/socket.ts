import { Server } from 'socket.io';
import http from 'http';
import express from 'express';
import axios from 'axios';
import https from 'https';

import Chat from '../models/ChatModel';
import { systemLogs } from '../utils/Logger';

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ['GET', 'POST'],
    },
});

let activeRooms: string[] = [];
const userPreferences = new Map<string, boolean>();
// const userPreferences = new Map<string, { enabled: boolean, rooms: string[] }>();

const sendRandomMessage = async (roomId: string) => {
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

io.on('connection', async (socket) => {
    console.log('User connected:', socket.id);

    userPreferences.set(socket.id, true);

    socket.on('toggleAutomatedMessages', (enabled: boolean) => {
        userPreferences.set(socket.id, enabled);
        console.log(
            `User ${socket.id} ${enabled ? 'enabled' : 'disabled'} automated messages`,
        );
    });

    const availableChats = await Chat.find({});

    availableChats.forEach((chat) => {
        socket.join(chat._id.toString());
        if (!activeRooms.includes(chat._id.toString())) {
            activeRooms.push(chat._id.toString());
        }
    });

    if (availableChats.length > 0 && userPreferences.get(socket.id)) {
        const randomChat =
            availableChats[Math.floor(Math.random() * availableChats.length)];
        await sendRandomMessage(randomChat._id.toString());
    }

    socket.on('join_room', (roomId) => {
        console.log(`User joined room: ${roomId}`);
        socket.join(roomId);

        if (!activeRooms.includes(roomId)) {
            activeRooms.push(roomId);
        }
        console.log('activeRooms', activeRooms);
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
            const roomSockets = await io.in(chatId).fetchSockets();

            roomSockets.forEach((s) => {
                if (userPreferences.get(s.id)) {
                    s.emit(`receiveMessage:${chatId}`, {
                        text: apiMessage,
                        sender: 'api',
                    });
                }
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

setInterval(async () => {
    if (activeRooms.length > 0) {
        const randomRoomId =
            activeRooms[Math.floor(Math.random() * activeRooms.length)];
        const roomSockets = await io.in(randomRoomId).fetchSockets();
        const shouldSendMessage = roomSockets.some((s) =>
            userPreferences.get(s.id),
        );

        if (shouldSendMessage) {
            await sendRandomMessage(randomRoomId);
        }
    }
}, 1300);

export { io, app, server };

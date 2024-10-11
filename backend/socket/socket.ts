import { Server } from 'socket.io';
import http from 'http';
import express from 'express';
import axios from 'axios';
import https from 'https';

import Chat from '../models/ChatModel';
import { systemLogs } from '../utils/Logger';
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
const userPreferences = new Map<string, boolean>();

const sendRandomMessage = async (roomId: string) => {
    try {
        const agent = new https.Agent({
            rejectUnauthorized: false,
        });

        const response = await axios.get('https://api.quotable.io/random', {
            httpsAgent: agent,
        });
        const apiMessage = response.data.content;

        const roomSockets = await io.in(roomId).fetchSockets();
        let messagesSent = false;

        for (const socket of roomSockets) {
            const userId = socket.data.userId;
            if (userPreferences.get(userId)) {
                socket.emit(`receiveMessage:${roomId}`, {
                    text: apiMessage,
                    sender: 'api',
                });
                messagesSent = true;
            }
        }

        if (messagesSent) {
            const chat = await Chat.findById(roomId);
            if (chat) {
                const newMessage = {
                    text: apiMessage,
                    sender: 'api',
                };
                chat.messages.push(newMessage);
                await chat.save();
            }
            console.log(`Отправлено сообщение в комнату: ${roomId}`);
        } else {
            console.log(
                `Сообщение не отправлено в комнату: ${roomId} (нет активных пользователей)`,
            );
        }
    } catch (error) {
        console.error('Не удалось отправить случайное сообщение:', error);
    }
};

io.on('connection', async (socket) => {
    console.log('User connected:', socket.id);

    socket.on('authenticate', async (userId) => {
        socket.data.userId = userId;
        const user = await User.findById(userId);
        if (user) {
            userPreferences.set(userId, user.automatedMessagesEnabled || false);
        } else {
            userPreferences.set(userId, true);
        }
        console.log(`Пользователь ${userId} аутентифицирован`);
    });

    socket.on('toggleAutomatedMessages', async (enabled: boolean) => {
        const userId = socket.data.userId;
        if (userId) {
            userPreferences.set(userId, enabled);
            await User.findByIdAndUpdate(userId, {
                automatedMessagesEnabled: enabled,
            });

            console.log(
                `Пользователь ${userId} ${enabled ? 'включил' : 'выключил'} автоматические сообщения`,
            );
        }
    });

    const availableChats = await Chat.find({});

    availableChats.forEach((chat) => {
        socket.join(chat._id.toString());
        if (!activeRooms.includes(chat._id.toString())) {
            activeRooms.push(chat._id.toString());
        }
    });

    socket.on('join_room', (roomId) => {
        console.log(`User joined room: ${roomId}`);
        socket.join(roomId);

        if (!activeRooms.includes(roomId)) {
            activeRooms.push(roomId);
        }
        ///   console.log('activeRooms', activeRooms);
    });

    socket.on('leave_room', (roomId) => {
        socket.leave(roomId);
        console.log(`User left room: ${roomId}`);
        activeRooms = activeRooms.filter((room) => room !== roomId);
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

            // roomSockets.forEach((s) => {
            //     if (userPreferences.get(s.id)) {
            //         s.emit(`receiveMessage:${chatId}`, {
            //             text: apiMessage,
            //             sender: 'api',
            //         });
            //     }
            // });
            socket.emit(`receiveMessage:${chatId}`, {
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

setInterval(async () => {
    if (activeRooms.length > 0) {
        const randomRoomId =
            activeRooms[Math.floor(Math.random() * activeRooms.length)];
        await sendRandomMessage(randomRoomId);
    }
}, 1300);

export { io, app, server };

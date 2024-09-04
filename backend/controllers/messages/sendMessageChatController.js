import asyncHandler from 'express-async-handler';
import axios from 'axios';
import mongoose from 'mongoose';

import Chat from '../../models/ChatModel.js';
import Conversation from '../../models/conversationModel.js';
import Message from '../../models/messageModel.js';
import { getReceiverSocketId, io } from '../../socket/socket.js';

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

    const newMessage = { text: message, sender: new mongoose.Types.ObjectId(req.user._id) };
    chat.messages.push(newMessage);

    // chat.messages.push(message);
    await chat.save();
    // console.log(chat);
    // io.to(chatId).emit('receive_message', message);
    io.to(chatId).emit('receiveMessage', newMessage);

    setTimeout(async () => {
        try {
            const response = await axios.get('https://api.quotable.io/random', {
                timeout: 5000,
            });
            const quote = response.data.content;
            const botMessage = { text: quote, sender: 'auto-bot' };
            chat.messages.push(botMessage);
            await chat.save();
            io.to(chatId).emit('receiveMessage', botMessage);
            // io.to(chatId).emit('receive_message', quote);
        } catch (error) {
            console.error('Error fetching quote:', error.message);
            const fallbackQuote = fallbackQuotes[
                Math.floor(Math.random() * fallbackQuotes.length)
            ];
            const botMessage = {
                text: fallbackQuote,
                sender: new mongoose.Types.ObjectId(req.user._id),
            };
            chat.messages.push(botMessage);
            await chat.save();
            io.to(chatId).emit('receiveMessage', botMessage);
        }
    }, 1000);

    res.status(200).json({ chat });
});

/// New version

const sendMessageChat = asyncHandler(async (req, res) => {
    try {
        // const { message } = req.body;
        const { message, receiverId } = req.body;
        // const { id: receiverId } = req.params;
        const senderId = req.user._id;

        /// console.log(receiverId);

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
            });
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message,
        });

        if (newMessage) {
            conversation.messages.push(newMessage._id);
        }

        await Promise.all([conversation.save(), newMessage.save()]);
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('newMessage', newMessage);
        }
        res.status(201).json(newMessage);
    } catch (error) {
        console.log('Error in sendMessage controller: ', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});
const getMessages = asyncHandler(async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const senderId = req.user._id;

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, userToChatId] },
        }).populate('messages');

        if (!conversation) return res.status(200).json([]);

        const messages = conversation.messages;
        res.status(200).json(messages);
    } catch (error) {
        console.log('Error in getMessages controller: ', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export { sendMessage, sendMessageChat, getMessages };

import asyncHandler from 'express-async-handler';
import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

import { Request, Response } from 'express';
import { systemLogs } from '../../utils/Logger';
import User from '../../models/UserModel';
import Chat from '../../models/ChatModel';
import { ChatData } from '../../types/ChatData';

const predefineChats = JSON.parse(
    fs.readFileSync(path.resolve('backend/data/defaultChats.json')).toString(),
);

const registerUser = async (req: Request, res: Response) => {
    try {
        const {
            email,
            username,
            firstName,
            lastName,
            password,
            passwordConfirm,
        } = req.body;

        if (!email) {
            res.status(400).json({ message: 'An email address is required' });
            throw new Error('An email address is required');
        }

        if (!username) {
            res.status(400).json({ message: 'A username is required' });
            throw new Error('A username is required');
        }

        if (!password) {
            res.status(400).json({ message: 'You must enter a password' });
            throw new Error('You must enter a password');
        }
        if (!passwordConfirm) {
            res.status(400).json({
                message: 'Confirm password field is required',
            });
            throw new Error('Confirm password field is required');
        }

        if (!lastName && !firstName) {
            res.status(400).json({
                message: 'Empty field',
            });
            throw new Error('Empty field');
        }

        const userExistsByEmail = await User.findOne({ email });
        if (userExistsByEmail) {
            res.status(400).json({ message: 'Email is already registered' });
            return;
        }

        const userExistsByUsername = await User.findOne({ username });
        if (userExistsByUsername) {
            res.status(400).json({ message: 'Username is already taken' });
            return;
        }

        const newUser = new User({
            email,
            username,
            firstName,
            lastName,
            password,
            passwordConfirm,
        });

        const registeredUser = await newUser.save();

        if (registeredUser) {
            await Promise.all(
                predefineChats.map(async (chatData: ChatData) => {
                    const updatedMessages = chatData.messages.map(
                        (message) => ({
                            ...message,
                            sender: 'system',
                            // sender: mongoose.Types.ObjectId.isValid(
                            //     message.sender,
                            // )
                            //     ? new mongoose.Types.ObjectId(message.sender)
                            //     : registeredUser._id,
                        }),
                    );
                    await Chat.create({
                        ...chatData,
                        user: registeredUser._id,
                        messages: updatedMessages,
                    });
                }),
            );
        }

        const accessSecret = process.env.JWT_ACCESS_SECRET_KEY;

        if (!accessSecret) {
            throw new Error('JWT_ACCESS_SECRET_KEY is not defined');
        }
        const accessToken = jwt.sign({ id: registeredUser._id }, accessSecret, {
            expiresIn: '7d',
        });

        res.status(201).json({
            _id: registeredUser._id,
            username: registeredUser.username,
            email: registeredUser.email,
            accessToken,
        });
    } catch (error) {
        systemLogs.error('Error register user :', error);
        console.error('Error register user:', error);
        res.status(500).json({ message: 'Error register user' });
    }
};

export default registerUser;

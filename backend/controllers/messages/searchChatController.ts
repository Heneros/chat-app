import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import Chat from '../../models/ChatModel.js';

const searchChat = async (req: Request, res: Response) => {
    const { keyword } = req.query;

    if (!keyword) {
        return res.status(400).json({ message: 'Search term is required' });
    }
    try {
        const searchResults = await Chat.find({
            $or: [
                { firstName: { $regex: keyword, $options: 'i' } },
                { lastName: { $regex: keyword, $options: 'i' } },
                {
                    'messages.text': {
                        $regex: keyword,
                        $options: 'i',
                    },
                },
            ],
        });

        const filteredResults = searchResults.map((chat) => {
            const filteredMessages = chat.messages.filter((message) =>
                message.text.match(new RegExp(keyword as string, 'i')),
            );

            return {
                _id: chat._id,
                firstName: chat.firstName,
                lastName: chat.lastName,
                messages: filteredMessages,
                // matchesName:
                //     chat.firstName.match(new RegExp(keyword, 'i')) ||
                //     chat.lastName.match(new RegExp(keyword, 'i')),
            };
        });

        if (!filteredResults.length) {
            return res.status(404).json({ message: 'No chats found' });
        }

        res.status(200).json(filteredResults);
    } catch (error) {
        ///  const err = error as Error;
        res.status(500).json({
            // message: 'Server Error searching chat',
            // error: err.message,
            message: 'Server Error search',
            error: (error as Error).message,
        });
    }
};

export default searchChat;

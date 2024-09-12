import asyncHandler from 'express-async-handler';
import Chat from '../../models/ChatModel.js';

const searchChat = asyncHandler(async (req, res) => {
    const { keyword } = req.query;

    if (!keyword) {
        return res.status(400).json({ message: 'Search term is required' });
    }

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
            message.text.match(new RegExp(keyword, 'i')),
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
});

export default searchChat;

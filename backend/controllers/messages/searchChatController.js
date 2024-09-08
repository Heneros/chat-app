import asyncHandler from 'express-async-handler';
import Chat from '../../models/ChatModel.js';

const searchChat = asyncHandler(async (req, res) => {
    // const searchTerm = req.body;
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
    const filteredResults = searchResults
        .map((chat) => {
            return {
                ...chat.toObject(),
                messages: chat.messages.filter((message) => {
                    message.text.match(new RegExp(keyword, 'i'));
                }),
            };
        })
        .filter((chat) => chat.messages.length > 0);

    if (!filteredResults.length) {
        return res.status(404).json({ message: 'No chats found' });
    }

    res.status(200).json(filteredResults);
});

export default searchChat;

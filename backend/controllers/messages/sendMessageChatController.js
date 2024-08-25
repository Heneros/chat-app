import asyncHandler from 'express-async-handler';
import axios from 'axios';
import Chat from '../../models/ChatModel.js';

const sendMessage = asyncHandler(async (req, res) => {
    const { chatId } = req.params;
    const { message } = req.body;

    const chat = await Chat.findById(chatId);

    chat.messages.push(message);

    setTimeout(async () => {
        const response = await axios.get('https://api.quotable.io/random');
        const quote = response.data.content;
        chat.messages.push(quote);
        await chat.save();

        global.io
            .to(global.onlineUsers.get(chatId))
            .emit('receive_message', quote);
    }, 3000);
    await chat.save();
    res.status(200).json({ success: true, chat });
});

export default sendMessage;

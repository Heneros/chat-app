import asyncHandler from 'express-async-handler';
import Chat from '../../models/ChatModel.js';

const deleteChat = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await Chat.findByIdAndDelete(id);
    res.status(204).json({ message: 'Chat Deleted' });
});

export default deleteChat;

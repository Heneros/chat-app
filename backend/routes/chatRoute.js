import express from 'express';
import createChat from '../controllers/messages/createChatController.js';
import deleteChat from '../controllers/messages/deleteChatController.js';
import updateChat from '../controllers/messages/updateChatController.js';
import {
    getMessages,
    sendMessage,
} from '../controllers/messages/sendMessageChatController.js';
import getAll from '../controllers/messages/getAllChatController.js';
import getChatById from '../controllers/messages/getChatByIdController.js';

import checkAuth from '../middleware/checkAuth.js';

const router = express.Router();

router.route('/').post(checkAuth, createChat).get(checkAuth, getAll);

router
    .route('/:chatId')
    .put(checkAuth, updateChat)
    .get(checkAuth, getMessages)
    .delete(checkAuth, deleteChat);

router.route('/:chatId/message').post(checkAuth, sendMessage);

export default router;

import { Router } from 'express';
import createChat from '../controllers/messages/createChatController';
import deleteChat from '../controllers/messages/deleteChatController';
import updateChat from '../controllers/messages/updateChatController';
import { sendMessage } from '../controllers/messages/sendMessageChatController';
import getAll from '../controllers/messages/getAllChatController';
import getChatById from '../controllers/messages/getChatByIdController';

import checkAuth from '../middleware/checkAuth';
import searchChat from '../controllers/messages/searchChatController';

const router = Router();

router.route('/').post(checkAuth, createChat).get(checkAuth, getAll);
router.route('/search').get(checkAuth, searchChat);
router
    .route('/:chatId')
    .put(checkAuth, updateChat)
    .get(checkAuth, getChatById)
    .delete(checkAuth, deleteChat);

router.route('/:chatId/message').post(checkAuth, sendMessage);

export default router;

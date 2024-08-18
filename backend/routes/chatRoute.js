import express from 'express';
import createChat from '../controllers/messages/createChatController.js';
import deleteChat from '../controllers/messages/deleteChatController.js';
import updateChat from '../controllers/messages/updateChatController.js';
import sendMessage from '../controllers/messages/sendMessageChatController.js';

const router = express.Router();

router.route('/').post(createChat);
router.route('/:id').put(updateChat);
router.route('/:id').delete(deleteChat);
router.route('/:id/message').post(sendMessage);

export default router;

import { useSendMessageToChatMutation } from './messagesSlice';

export const useSendMessageToChatMutation = () => {
    const [sendMessage] = useSendMessageToChatMutation();

    const sendMessageToChat = async ({ chatId, message }) => {
        try {
            await sendMessage({ chatId, message }).unwrap();
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    return sendMessageToChat;
};

import React from 'react';
import { useSendMessageToChatMutation } from '@/features/messages/messagesSlice';
import socket from '../Socket/socket';

interface MessageInputProps {
    newMessage: string;
    setNewMessage: (message: string) => void;
    chatId: string;
}

export const MessageInput: React.FC<MessageInputProps> = ({
    newMessage,
    setNewMessage,
    chatId,
}) => {
    const [sendMessage] = useSendMessageToChatMutation();

    const handleSendMessage = async () => {
        if (newMessage.trim() === '' || !chatId) return;
        try {
            await sendMessage({ chatId, message: newMessage }).unwrap();
            socket.emit('sendMessage', { chatId, text: newMessage });
            setNewMessage('');
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <div className="message-input">
            <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                onKeyDown={handleKeyDown}
            />
            <button type="submit" onClick={handleSendMessage}>
                Send
            </button>
        </div>
    );
};

import React from 'react';
import { Message } from '@/shared/types/ChatType';

interface ChatMessageProps {
    message: Message;
    isSentByUser: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
    message,
    isSentByUser,
}) => {
    return (
        <div className={`message ${isSentByUser ? 'sent' : 'received'}`}>
            {message.text}
        </div>
    );
};

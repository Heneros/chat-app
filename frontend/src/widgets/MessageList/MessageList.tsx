import React from 'react';

import { Message } from '@/shared/types/ChatType';

interface MessageListProps {
    messages: Message[];
    userId: string;
}

const MessageList: React.FC<MessageListProps> = ({ messages, userId }) => {
    return (
        <div className="messageList">
            {messages && Array.isArray(messages) ? (
                messages?.map((msg) => (
                    <div
                        key={msg._id}
                        className={`message ${
                            msg.sender === userId ? 'sent' : 'received'
                        }`}
                    >
                        {msg.text}
                    </div>
                ))
            ) : (
                <div>No messages yet...</div>
            )}
        </div>
    );
};

export default MessageList;

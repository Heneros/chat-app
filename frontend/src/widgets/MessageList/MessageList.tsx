import React from 'react';

import { Message } from '@/shared/types/ChatType';

interface MessageListProps {
    allMessages: Message[];
    userId: string;
}

const MessageList: React.FC<MessageListProps> = ({ allMessages, userId }) => {
    return (
        <div className="messageList">
            {allMessages && Array.isArray(allMessages) ? (
                allMessages?.map((msg, index) => (
                    <div
                        key={msg._id || index}
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

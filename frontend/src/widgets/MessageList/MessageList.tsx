import React, { useState } from 'react';
import { Message } from '@/shared/types/ChatType';

interface MessageListProps {
    allMessages: Message[];
    userId: string;
    chatId: string;
    socket: any;
}

const MessageList: React.FC<MessageListProps> = ({
    allMessages,
    userId,
    chatId,
    socket,
}) => {
    const [editingMessageId, setEditingMessageId] = useState<string | null>(
        null,
    );
    const [newText, setNewText] = useState<string>('');

    const handleEdit = (msgId: string, currentText: string) => {
        setEditingMessageId(msgId);
        setNewText(currentText);
    };
    // console.log('editMessage ', chatId);
    const handleSaveEdit = () => {
        if (editingMessageId && chatId) {
            socket.emit('editMessage', {
                chatId,
                messageId: editingMessageId,
                newText,
            });
            setEditingMessageId(null);
            setNewText('');
        }
    };

    return (
        <div className="messageList">
            {allMessages && Array.isArray(allMessages) ? (
                allMessages.map((msg, index) => {
                    const isSentByUser = msg.sender === userId;
                    const msgSrc = `<img src="${msg?.imageUrl}" alt="image" />`;
                    return (
                        <div
                            key={msg._id || index}
                            className={`message ${isSentByUser ? 'sent' : 'received'}`}
                        >
                            {editingMessageId === msg._id ? (
                                <>
                                    <input
                                        type="text"
                                        value={newText}
                                        onChange={(e) =>
                                            setNewText(e.target.value)
                                        }
                                    />
                                    <button
                                        type="button"
                                        onClick={handleSaveEdit}
                                    >
                                        Save
                                    </button>
                                </>
                            ) : (
                                <>
                                    {msg.imageUrl ? (
                                        <img
                                            src={msg.imageUrl}
                                            alt="message attachment"
                                            style={{
                                                maxWidth: '100%',
                                                height: 'auto',
                                            }}
                                        />
                                    ) : null}
                                    {msg.text ? <span>{msg.text}</span> : null}

                                    
                                    {isSentByUser && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleEdit(msg._id, msg.text)
                                            }
                                        >
                                            Edit
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    );
                })
            ) : (
                <div>No messages yet...</div>
            )}
        </div>
    );
};

export default MessageList;

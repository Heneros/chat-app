import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import './ChatHeader.css';

import { ChatType } from '@/shared/types';
import { useUpdateChatMutation } from '@/features/messages/messagesSlice';

const socket = io('http://localhost:3000');

// interface ChatHeader extends Omit<ChatType, 'messages'> {
//     selectedChat: ChatType | null;
//     chatId: string;
// }
interface ChatHeaderProps {
    selectedChat: ChatType | null;
    chatId: string;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
    selectedChat,
    chatId,
}) => {
    const [editMode, setEditMode] = useState(false);
    const [chatName, setChatName] = useState({ firstName: '', lastName: '' });
    const [updateChat] = useUpdateChatMutation();

    useEffect(() => {
        if (selectedChat) {
            setChatName({
                firstName: selectedChat.firstName || '',
                lastName: selectedChat.lastName || '',
            });
        }
    }, [selectedChat]);

    useEffect(() => {
        const handleChatUpdated = (updatedChat: ChatType) => {
            if (updatedChat._id === chatId) {
                setChatName({
                    firstName: updatedChat.firstName,
                    lastName: updatedChat.lastName,
                });
            }
        };

        socket.on('chatUpdated', handleChatUpdated);

        return () => {
            socket.off('chatUpdated', handleChatUpdated);
        };
    }, [chatId]);

    const handleUpdateChat = async () => {
        if (!chatId) return;

        await updateChat({
            chatId,
            firstName: chatName.firstName,
            lastName: chatName.lastName,
        }).unwrap();

        socket.emit('updateChat', {
            chatId,
            firstName: chatName.firstName,
            lastName: chatName.lastName,
        });

        setEditMode(false);
    };

    return (
        <div className="chat-header">
            {editMode ? (
                <>
                    <input
                        type="text"
                        value={chatName.firstName}
                        onChange={(e) =>
                            setChatName((prev) => ({
                                ...prev,
                                firstName: e.target.value,
                            }))
                        }
                        placeholder="First Name"
                    />
                    <input
                        type="text"
                        value={chatName.lastName}
                        onChange={(e) =>
                            setChatName((prev) => ({
                                ...prev,
                                lastName: e.target.value,
                            }))
                        }
                        placeholder="Last Name"
                    />
                    <button type="submit" onClick={handleUpdateChat}>
                        Save
                    </button>
                    <button type="submit" onClick={() => setEditMode(false)}>
                        Cancel
                    </button>
                </>
            ) : (
                <>
                    <h1>
                        {chatName.firstName} {chatName.lastName}
                    </h1>
                    <button type="submit" onClick={() => setEditMode(true)}>
                        Edit
                    </button>
                </>
            )}
        </div>
    );
};

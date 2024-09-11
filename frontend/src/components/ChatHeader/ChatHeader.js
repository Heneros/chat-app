import React, { useEffect, useState } from 'react';
import './ChatHeader.css';
import { useUpdateChatMutation } from '../../redux/slices/messagesSlice';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');
export const ChatHeader = ({ selectedChat, chatId }) => {
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
        const handleChatUpdated = (updatedChat) => {
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
                    <button onClick={handleUpdateChat}>Save</button>
                    <button onClick={() => setEditMode(false)}>Cancel</button>
                </>
            ) : (
                <>
                    <h1>
                        {chatName.firstName} {chatName.lastName}
                    </h1>
                    <button onClick={() => setEditMode(true)}>Edit</button>
                </>
            )}
        </div>
    );
};

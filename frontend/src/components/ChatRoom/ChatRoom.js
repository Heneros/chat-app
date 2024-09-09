import React, { useCallback, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import {
    useGetByIdChatQuery,
    useSendMessageToChatMutation,
    useUpdateChatMutation,
} from '../../redux/slices/messagesSlice';

const socket = io('http://localhost:4000');

export const ChatRoom = ({ selectedChat }) => {
    const { _id: chatId } = selectedChat || {};

    const {
        data: chatData,
        isLoading,
        error,
    } = useGetByIdChatQuery({ chatId });
    const [sendMessage] = useSendMessageToChatMutation();
    const [updateChat] = useUpdateChatMutation();

    const [editMode, setEditMode] = useState(false);

    const [updatedFirstName, setUpdatedFirstName] = useState('');
    const [updatedLastName, setUpdatedLastName] = useState('');

    const [newMessage, setNewMessage] = useState('');
    const [allMessages, setAllMessages] = useState([]);

    const handleReceiveMessage = useCallback((data) => {
        setAllMessages((prevMessages) => {
            const messageArray = Array.isArray(prevMessages)
                ? prevMessages
                : [];

            return [...messageArray, data];
        });
    }, []);

    useEffect(() => {
        if (selectedChat) {
            setUpdatedFirstName(selectedChat.firstName || '');
            setUpdatedLastName(selectedChat.lastName || '');
        }
    }, [selectedChat]);

    useEffect(() => {
        if (chatId) {
            socket.emit('leave_room', socket.previousRoom);

            socket.emit('join_room', chatId);

            socket.previousRoom = chatId;
            socket.on(`receiveMessage:${chatId}`, handleReceiveMessage);
            if (
                chatData &&
                chatData.messages &&
                Array.isArray(chatData.messages)
            ) {
                setAllMessages([...chatData.messages]);
            }

            return () => {
                if (chatId) {
                    socket.off(
                        `receiveMessage:${chatId}`,
                        handleReceiveMessage,
                    );
                }
            };
        } else {
            console.log('no chatid');
        }
    }, [chatId, chatData, handleReceiveMessage]);

    const handleSendMessage = async () => {
        if (newMessage.trim() === '' || !chatId) return;

        try {
            await sendMessage({
                chatId: chatId,
                message: newMessage,
            }).unwrap();

            socket.emit('sendMessage', { chatId, text: newMessage });

            setNewMessage('');
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    const handleUpdateChat = async () => {
        if (!chatId) return;
        try {
            await updateChat({
                chatId,
                firstName: updatedFirstName,
                lastName: updatedLastName,
            }).unwrap();
            setEditMode(false);
        } catch (error) {
            console.error('Failed to update chat:', error);
        }
    };
    // console.log('socket', messageSocket);
    // console.log('chatData', chatData);
    // console.log('allMessages', allMessages);
    return (
        <div className="chat-room">
            {selectedChat ? (
                <>
                    <div className="chat-title">
                        {editMode ? (
                            <>
                                <input
                                    type="text"
                                    value={updatedFirstName}
                                    onChange={(e) =>
                                        setUpdatedFirstName(e.target.value)
                                    }
                                    placeholder="First Name"
                                />
                                <input
                                    type="text"
                                    value={updatedLastName}
                                    onChange={(e) =>
                                        setUpdatedLastName(e.target.value)
                                    }
                                    placeholder="Last Name"
                                />
                                <button onClick={handleUpdateChat}>Save</button>
                                <button onClick={() => setEditMode(false)}>
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <>
                                <h1>
                                    {selectedChat.firstName}{' '}
                                    {selectedChat.lastName}
                                </h1>
                                <button onClick={() => setEditMode(true)}>
                                    Edit
                                </button>
                            </>
                        )}
                    </div>
                    <div className="messageSocket">
                        {isLoading ? (
                            <>Loading...</>
                        ) : error ? (
                            <div>
                                Error happened:
                                {error.message || JSON.stringify(error)}
                            </div>
                        ) : (
                            <>
                                <div className="messageSocket">
                                    {allMessages.length > 0 ? (
                                        allMessages.map((msg, index) => (
                                            <div
                                                key={index}
                                                className={`message ${
                                                    msg.sender === 'user'
                                                        ? 'sent'
                                                        : 'received'
                                                }`}
                                            >
                                                {msg.text}
                                            </div>
                                        ))
                                    ) : (
                                        <div>No messageSocket yet...</div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                    <div className="message-input">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                        />
                        <button onClick={handleSendMessage}>Send</button>
                    </div>
                </>
            ) : (
                <div>Select a chat to start messaging</div>
            )}
        </div>
    );
};

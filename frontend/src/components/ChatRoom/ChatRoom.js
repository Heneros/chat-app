import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { decodeToken } from 'react-jwt';
import { useSelector } from 'react-redux';

import { selectCurrentUserToken } from '../../redux/slices/auth';
import {
    useGetByIdChatQuery,
    useSendMessageToChatMutation,
} from '../../redux/slices/messagesSlice';

const socket = io('http://localhost:4000');

export const ChatRoom = ({ selectedChat }) => {
    const { _id: chatId } = selectedChat || {};
    const currentUserId = useSelector(selectCurrentUserToken);
    const decodedToken = decodeToken(currentUserId);
    const userId = decodedToken?._id;

    const { data, isLoading, error } = useGetByIdChatQuery({ chatId });
    const [sendMessage] = useSendMessageToChatMutation();
    // const [messagesChat, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if (chatId) {
            socket.emit('joinChat', chatId);

            socket.on('chatHistory', (messages) => {
                setMessages(messages);
            });

            socket.on('receiveMessage', (message) => {
                setMessages((prevMessages) => [...prevMessages, message]);
            });
        }

        return () => {
            socket.off('receiveMessage');
            socket.off('chatHistory');
        };
    }, [chatId]);

    const handleSendMessage = async () => {
        if (newMessage.trim() === '' || !chatId) return;

        try {
            // const messageData = {
            //     to: String(chatId),
            //     msg: String(newMessage),
            // };

            await sendMessage({
                chatId: chatId,
                message: newMessage,
            }).unwrap();
            socket.emit('sendMessage', { chatId, message: newMessage });

            // socket.emit('sendMessage', messageData);
            setNewMessage('');
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    return (
        <div className="chat-room">
            {selectedChat ? (
                <>
                    <div className="chat-title">
                        <h1>
                            {selectedChat.firstName} {selectedChat.lastName}
                        </h1>
                    </div>
                    <div className="messages">
                        {isLoading ? (
                            <>Loading...</>
                        ) : error ? (
                            <div>
                                Error happened:{' '}
                                {error.message || JSON.stringify(error)}
                            </div>
                        ) : (
                            <>
                                {messages.map((msg, index) => (
                                    <div
                                        key={index}
                                        className={`message ${msg.sender}`}
                                    >
                                        {msg.text}
                                    </div>
                                ))}
                            </>
                        )}
                        <div>
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type a message..."
                            />
                            <button onClick={handleSendMessage}>Send</button>
                        </div>
                    </div>
                </>
            ) : (
                <></>
            )}
        </div>
    );
};

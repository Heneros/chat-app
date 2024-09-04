import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { selectCurrentUserToken } from '../../redux/slices/auth';
import { decodeToken } from 'react-jwt';
import {
    useGetByIdChatQuery,
    useSendMessageToChatMutation,
} from '../../redux/slices/messagesSlice';

const socket = io('http://localhost:4000');

export const ChatRoom = ({ selectedChat }) => {
    const { _id: chatId } = selectedChat || {};
    const currentsenderId = useSelector(selectCurrentUserToken);
    const decodedToken = decodeToken(currentsenderId);
    const senderId = decodedToken?._id;

    const {
        data: chatHistory,
        isLoading,
        error,
    } = useGetByIdChatQuery({ chatId });
    const [sendMessage] = useSendMessageToChatMutation();
    const [newMessage, setNewMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [chatMessages, setChatMessages] = useState([]);

    console.log(messages);
    useEffect(() => {
        if (chatHistory) {
            setMessages(chatHistory.messages);
        }
    }, [chatHistory]);

    useEffect(() => {
        if (chatId) {
            socket.emit('joinChat', chatId);

            socket.on('receiveMessage', (message) => {
                setMessages((prevMessages) => [...prevMessages, message]);
            });
        }

        return () => {
            socket.off('receiveMessage');
        };
    }, [chatId]);

    const handleSendMessage = async () => {
        if (newMessage.trim() === '' || !chatId) return;

        try {
            await sendMessage({
                chatId: chatId,
                message: newMessage,
            }).unwrap();

            socket.emit('sendMessage', { chatId, message: newMessage });

            setNewMessage('');
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
                                {messages?.map((msg, index) => (
                                    <div
                                        key={index}
                                        className={`message ${
                                            msg.senderId === senderId
                                                ? 'sent'
                                                : 'received'
                                        }`}
                                    >
                                        {msg}
                                    </div>
                                ))}
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

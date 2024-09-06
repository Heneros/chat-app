import React, { useCallback, useEffect, useState } from 'react';
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

    const {
        data: chatHistory,
        isLoading,
        error,
        refetch,
    } = useGetByIdChatQuery({ chatId });
    const [sendMessage] = useSendMessageToChatMutation();
    const [newMessage, setNewMessage] = useState('');
    const [messages, setMessages] = useState([]);

    // useEffect(() => {
    //     console.log('client', socket.id);
    // });
    const handleReceiveMessage = useCallback((data) => {
        console.log('Received message:', data);
        setMessages((prevMessages) => [...prevMessages, data]);
    }, []);

    
    useEffect(() => {
        if (chatId) {
            socket.emit('leave_room', socket.previousRoom);

            socket.emit('join_room', chatId);

            socket.previousRoom = chatId;

            socket.on('receiveMessage', (data) => {
                // console.log('Received message:', data);
                setMessages((prevMessages) => [...prevMessages, data]);
            });
        } else {
            console.log('no chatid');
        }

        return () => {
            socket.off('receiveMessage');
        };
    }, [chatId]);

    const handleSendMessage = async () => {
        if (newMessage.trim() === '' || !chatId) return;

        try {
            // await sendMessage({
            //     chatId: chatId,
            //     message: newMessage,
            // }).unwrap();
            const userMessage = { message: newMessage, sender: 'user' };
            setMessages((prevMessages) => [...prevMessages, userMessage]);
            socket.emit('sendMessage', { chatId, message: newMessage });

            setNewMessage('');
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };
    console.log(messages);
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
                                Error happened:
                                {error.message || JSON.stringify(error)}
                            </div>
                        ) : (
                            <>
                                <div className="messages">
                                    {messages.length > 0 ? (
                                        messages.map((msg, index) => (
                                            <div
                                                key={index}
                                                className={`message ${
                                                    msg.sender === 'user'
                                                        ? 'sent'
                                                        : 'received'
                                                }`}
                                            >
                                                {msg.message}
                                            </div>
                                        ))
                                    ) : (
                                        <div>No messages yet...</div>
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

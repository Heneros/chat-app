import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { decodeToken } from 'react-jwt';

import { selectCurrentUserToken } from '../../redux/slices/auth';
import {
    useGetByIdChatQuery,
    useSendMessageToChatMutation,
} from '../../redux/slices/messagesSlice';
import { useSelector } from 'react-redux';

const socket = io('http://localhost:4000');

export const ChatRoom = ({ selectedChat }) => {
    const currentUserId = useSelector(selectCurrentUserToken);

    const decodedToken = decodeToken(currentUserId);

    const { _id } = decodedToken;

    const { data, isLoading, error } = useGetByIdChatQuery({
        postId: selectedChat?._id,
    });
    const [sendMessage] = useSendMessageToChatMutation();
    const [messagesChat, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    const messages = data?.messages.messages || [];
    useEffect(() => {
        if (selectedChat && _id) {
            socket.emit('add-user', _id._id);
            socket.emit('joinChat', _id._id);
        }
    }, [selectedChat, _id]);
    // console.log({ messages });

    useEffect(() => {
        socket.on('receive_message', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            socket.off('receive_message');
        };
    }, []);

    useEffect(() => {
        if (data?.messages?.messages) {
            setMessages(data.messages.messages);
        }
    }, [data]);
    const handleSendMessage = async () => {
        if (newMessage.trim() === '') return;

        try {
            await sendMessage({
                id: selectedChat._id,
                message: newMessage,
            }).unwrap();

            socket.emit('sendMessage', {
                to: selectedChat._id,
                msg: newMessage,
            });

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
                            <>Error happened{error}</>
                        ) : (
                            <>
                                {messages.map((message, index) => (
                                    <div key={index}>{message}</div>
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

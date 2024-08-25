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
    const { _id: chatId } = selectedChat || {};
    const currentUserId = useSelector(selectCurrentUserToken);
    const decodedToken = decodeToken(currentUserId);
    const userId = decodedToken?._id;

    const { data, isLoading, error } = useGetByIdChatQuery({ chatId });
    const [sendMessage] = useSendMessageToChatMutation();
    const [messagesChat, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        if (selectedChat && userId) {
            socket.emit('add-user', userId);
            socket.emit('joinChat', chatId);
        }
    }, [selectedChat, userId]);

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
    useEffect(() => {
        if (selectedChat && userId) {
            socket.emit('add-user', userId);
            if (chatId) {
                socket.emit('joinChat', chatId);
            } else {
                console.error('Chat ID is undefined when joining chat');
            }
        }
    }, [selectedChat, userId, chatId]);
    const handleSendMessage = async () => {
        if (newMessage.trim() === '' || !chatId) return;

        if (!chatId) {
            console.error('Chat ID is undefined');
            return;
        }

        try {
            const messageData = {
                to: String(chatId),
                msg: String(newMessage),
            };
            // console.log(messageData); ///msg
            // :
            // "sad"
            // to
            // :
            // "66cb3c06dca5924d3b0c347d"
            await sendMessage({
                chatId: chatId,
                message: newMessage,
            }).unwrap();

            socket.emit('sendMessage', messageData);

            setNewMessage('');
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };
    // console.log(newMessage);

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
                                {data?.messages.map((message, index) => (
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

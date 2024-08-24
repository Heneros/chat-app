import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

import { selectCurrentUserToken } from '../../redux/slices/auth';
import { useGetByIdChatQuery } from '../../redux/slices/messagesSlice';

const socket = io('http://localhost:4000');

export const ChatRoom = ({ selectedChat }) => {
    const { data, isLoading, error } = useGetByIdChatQuery({
        postId: selectedChat?._id,
    });
    const [messagesChat, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        if (selectedChat) {
            socket.emit('joinChat', selectedChat._id);
            setMessages(selectedChat.messagesChat);
        }
    }, [selectedChat]);

    useEffect(() => {
        socket.on('receiveMessage', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            socket.off('receiveMessage');
        };
    }, []);
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    console.log({ data });

    const messages = data?.messages || [];

    const handleSendMessage = () => {
        socket.emit('sendMessage', {
            _id: messages?._id,
            firstName: 'User',
            lastName: 'User lastname',
            text: newMessage,
        });
        setNewMessage('');
    };

    return (
        <div className="chat-room">
            {selectedChat ? (
                <>
                    <div class="chat-title">
                        <h1>
                            {selectedChat.firstName} {selectedChat.lastName}
                        </h1>

                        {/* avatar place <figure class="avatar">
                            <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/156381/profile/profile-80.jpg" />
                        </figure> */}
                    </div>
                    <div className="messages">
                        {messages.length > 0 ? (
                            messages?.map((message, index) => (
                                <div key={index}>
                                    <p>{message.content}</p>
                                </div>
                            ))
                        ) : (
                            <>123</>
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

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { decodeToken } from 'react-jwt';
import { io } from 'socket.io-client';

import { selectCurrentUserToken } from '../../redux/slices/auth';
import { useSendMessageToChatMutation } from '../../redux/slices/messagesSlice';

export const ChatRoom = ({ selectedChat }) => {
    const [message, setMessage] = useState('');
    const token = useSelector(selectCurrentUserToken);
    // const decodedToken = jwt_decode(token);
    // const currentUserId = decodedToken.id;
    const decodedToken = decodeToken(token);
    const { _id } = decodedToken;
    const sendMessage = (e) => {
        e.preventDefault();
        if (message.trim() && selectedChat) {
            console.log('Sending message:', message);
            setMessage('');
        }
    };

    if (!selectedChat) return <div>Select a chat to start messaging</div>;
    return (
        <div className="chat-room">
            <h2>
                {selectedChat.firstName} {selectedChat.lastName}
            </h2>
            <div className="chat-messages">
                {selectedChat.messages.map((msg, index) => (
                    <div
                        key={index}
                        className={msg.sender === _id ? 'sent' : 'received'}
                    >
                        {msg.content}
                    </div>
                ))}
            </div>
            <form onSubmit={sendMessage} className="message-form">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

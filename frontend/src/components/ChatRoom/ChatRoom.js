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

    const {
        data: chatHistory,
        isLoading,
        error,
        refetch,
    } = useGetByIdChatQuery({ chatId }, { skip: !chatId });
    const [sendMessage] = useSendMessageToChatMutation();
    const [newMessage, setNewMessage] = useState('');
    const [room, setRoom] = useState('1');
    const [messageReceived, setMessageReceived] = useState('');
    const [messages, setMessages] = useState([]);
    const [chatMessages, setChatMessages] = useState([]);

    useEffect(() => {
        socket.on('receiveMessage', (data) => {
            setMessageReceived(data);
        });
        socket.emit('join_room', '1');
    }, [socket]);
    
    const handleSendMessage = async () => {
        if (newMessage.trim() === '' || !chatId) return;

        try {
            // await sendMessage({
            //     chatId: chatId,
            //     message: newMessage,
            // }).unwrap();

            socket.emit('sendMessage', { chatId, message: newMessage });

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
                                {messageReceived}
                                {/* {messages?.map((msg, index) => (
                                    <div
                                        key={index}
                                        className={`message ${
                                            msg.senderId === senderId
                                                ? 'sent'
                                                : 'received'
                                        }`}
                                    >
                                        {msg.text}
                                    </div>
                                ))} */}
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

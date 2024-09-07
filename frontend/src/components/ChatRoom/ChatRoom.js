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
        data: chatData,
        isLoading,
        error,
        refetch,
    } = useGetByIdChatQuery({ chatId });
    const [sendMessage] = useSendMessageToChatMutation();
    const [newMessage, setNewMessage] = useState('');
    const [messageSocket, setMessages] = useState([]);
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
    console.log('socket', messageSocket);
    console.log('chatData', chatData);
    console.log('allMessages', allMessages);
    return (
        <div className="chat-room">
            {selectedChat ? (
                <>
                    <div className="chat-title">
                        <h1>
                            {selectedChat.firstName} {selectedChat.lastName}
                        </h1>
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

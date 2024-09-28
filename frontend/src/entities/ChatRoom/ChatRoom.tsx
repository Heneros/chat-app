import React, { useCallback, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { decodeToken } from 'react-jwt';
import { useSelector } from 'react-redux';
import { ChatType } from '@/shared/types';

import './ChatRoom.css';
import {
    useGetByIdChatQuery,
    useSendMessageToChatMutation,
} from '@/features/messages/messagesSlice';
import { selectCurrentUserToken } from '@/features/auth/auth';
import { ChatHeader } from '@/widgets/ChatHeader/ChatHeader';
import { useAppSelector } from '@/shared/lib/store';

const socket = io('http://localhost:4000');

interface ChatRoomProps {
    selectedChat: ChatType;
}

interface DecodedToken {
    id: string;
}

export const ChatRoom: React.FC<ChatRoomProps> = ({ selectedChat }) => {
    const { _id: chatId } = selectedChat || {};

    const {
        data: chatData,
        isLoading,
        error,
    } = useGetByIdChatQuery({ chatId });
    const tokenArray = useAppSelector(selectCurrentUserToken);

    // const token = useAppSelector(selectCurrentUserToken);
    const token: string | undefined =
        tokenArray && tokenArray.length > 0 ? tokenArray[0] : undefined;

    if (token) {
        const decodedToken = decodeToken<DecodedToken>(token);
        if (decodedToken && 'id' in decodedToken) {
            const { id: userId } = decodedToken;

            const [sendMessage] = useSendMessageToChatMutation();

            const [newMessage, setNewMessage] = useState('');
            const [allMessages, setAllMessages] = useState([]);

            const handleReceiveMessage = useCallback((data: ChatType) => {
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
            return (
                <div className="chat-room">
                    {selectedChat ? (
                        <>
                            <ChatHeader
                                selectedChat={selectedChat}
                                chatId={chatId}
                            />
                            <div className="messageContainer">
                                {isLoading ? (
                                    <>Loading...</>
                                ) : error ? (
                                    <div>
                                        Error happened:
                                        {error.message || JSON.stringify(error)}
                                    </div>
                                ) : (
                                    <div className="messageList">
                                        {allMessages.length > 0 ? (
                                            allMessages.map((msg, index) => (
                                                <div
                                                    key={index}
                                                    className={`message ${
                                                        msg.sender === userId
                                                            ? 'sent'
                                                            : 'received'
                                                    }`}
                                                >
                                                    {msg.text}
                                                </div>
                                            ))
                                        ) : (
                                            <div>No messages yet...</div>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="message-input">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) =>
                                        setNewMessage(e.target.value)
                                    }
                                    placeholder="Type a message..."
                                />
                                <button onClick={handleSendMessage}>
                                    Send
                                </button>
                            </div>
                        </>
                    ) : (
                        <div>Select a chat to start messaging</div>
                    )}
                </div>
            );
        }
    }
};

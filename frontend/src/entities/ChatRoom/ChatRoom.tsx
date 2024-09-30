import React, { useCallback, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { decodeToken } from 'react-jwt';
import { ChatType } from '@/shared/types';

import './ChatRoom.css';
import {
    useGetByIdChatQuery,
    useSendMessageToChatMutation,
} from '@/features/messages/messagesSlice';
import { selectCurrentUserToken } from '@/features/auth/auth';
import { ChatHeader } from '@/widgets/ChatHeader/ChatHeader';
import { useAppSelector } from '@/shared/lib/store';
import { getErrorMessage } from '@/shared/utils/getErrorMessage';
import { Message } from '@/shared/types/ChatType';

interface SocketWithRoom extends Socket {
    previousRoom?: string;
}

const socket: SocketWithRoom = io('http://localhost:4000');

interface ChatRoomProps {
    selectedChat: ChatType;
}

interface DecodedToken {
    id: string;
}

export const ChatRoom: React.FC<ChatRoomProps> = ({ selectedChat }) => {
    const { _id: chatId } = selectedChat;

    const {
        data: chatData,
        isLoading,
        error,
    } = useGetByIdChatQuery({ chatId });
    const tokenArray = useAppSelector(selectCurrentUserToken);

    const token: string | undefined = tokenArray;

    if (token) {
        const decodedToken = decodeToken<DecodedToken>(token);
        // console.log('decodedToken', decodedToken);
        if (decodedToken && 'id' in decodedToken) {
            const { id: userId } = decodedToken;
            // console.log('userId', userId);
            const [sendMessage] = useSendMessageToChatMutation();

            const [newMessage, setNewMessage] = useState('');
            const [allMessages, setAllMessages] = useState<Message[]>([]);

            const handleReceiveMessage = useCallback((data: Message) => {
                setAllMessages((prevMessages) => [...prevMessages, data]);
            }, []);

            useEffect(() => {
                if (chatId) {
                    socket.emit('leave_room', socket.previousRoom);
                    socket.emit('join_room', chatId);
                    socket.previousRoom = chatId;
                    socket.on(`receiveMessage:${chatId}`, handleReceiveMessage);

                    if (chatData && Array.isArray(chatData.messages)) {
                        setAllMessages(chatData.messages);
                    }

                    return () => {
                        if (chatId) {
                            socket.off(
                                `receiveMessage:${chatId}`,
                                handleReceiveMessage,
                            );
                        }
                    };
                }
            }, [chatId, chatData, handleReceiveMessage]);

            const handleSendMessage = async () => {
                if (newMessage.trim() === '' || !chatId) return;

                try {
                    await sendMessage({
                        chatId,
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
                                    <div>{getErrorMessage(error)}</div>
                                ) : (
                                    <div className="messageList">
                                        {allMessages &&
                                        Array.isArray(allMessages) ? (
                                            allMessages?.map((msg) => (
                                                <div
                                                    key={msg._id}
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
                                <button
                                    type="submit"
                                    onClick={handleSendMessage}
                                >
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

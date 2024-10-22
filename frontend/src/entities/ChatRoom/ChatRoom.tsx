import React, { useCallback, useEffect, useRef, useState } from 'react';
import { decodeToken } from 'react-jwt';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { ChatType } from '@/shared/types';
import './ChatRoom.css';
import { useGetByIdChatQuery } from '@/features/messages/messagesSlice';
import { selectCurrentUserToken } from '@/features/auth/auth';
import { ChatHeader } from '@/widgets/Chats/ChatHeader/ChatHeader';
import { useAppSelector } from '@/shared/lib/store';
import { getErrorMessage } from '@/shared/utils/getErrorMessage';
import { Message } from '@/shared/types/ChatType';
import MessageList from '@/widgets/MessageList/MessageList';
import { MessageInput } from '@/widgets/MessageInput/MessageInput';
import socket from '@/widgets/Socket/socket';

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
    const [allMessages, setAllMessages] = useState<Message[]>([]);

    if (token) {
        const decodedToken = decodeToken<DecodedToken>(token);

        if (decodedToken && 'id' in decodedToken) {
            const { id: userId } = decodedToken;

            const [newMessage, setNewMessage] = useState('');
            socket.emit('authenticate', userId);

            const handleReceiveMessage = useCallback((data: Message) => {
                setAllMessages((prevMessages) => [...prevMessages, data]);

                if (data.sender === 'api') {
                    toast.info(`New message from ${data.sender}`, {
                        position: 'bottom-right',
                        autoClose: 3000,
                    });
                }
            }, []);

            useEffect(() => {
                if (chatId) {
                    socket.emit('leave_room', socket.previousRoom);
                    const data = {
                        userId,
                        chatId,
                    };
                    socket.emit('join_room', data);

                    socket.previousRoom = chatId;
                    socket.on(`receiveMessage:${chatId}`, handleReceiveMessage);

                    socket.on('messageUpdated', ({ messageId, newText }) => {
                        //   setAllMessages((prevMessages) => [...prevMessages, data]);
                        setAllMessages((prevMessages) =>
                            prevMessages.map((msg) =>
                                msg._id === messageId
                                    ? { ...msg, text: newText }
                                    : msg,
                            ),
                        );
                    });

                    return () => {
                        socket.off(
                            `receiveMessage:${chatId}`,
                            handleReceiveMessage,
                        );
                        socket.off('connect_error');
                    };
                }
            }, [chatId, handleReceiveMessage]);

            useEffect(() => {
                if (chatData && Array.isArray(chatData.messages)) {
                    setAllMessages(chatData.messages);
                }
            }, [chatData, isLoading]);

            const endOfMessagesRef = useRef<HTMLDivElement | null>(null);
            const scrollToBottom = () => {
                if (endOfMessagesRef.current) {
                    endOfMessagesRef.current.scrollIntoView({
                        behavior: 'smooth',
                    });
                }
            };

            useEffect(() => {
                scrollToBottom();
            }, [allMessages]);
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
                                    <MessageList
                                        allMessages={allMessages}
                                        userId={userId}
                                        chatId={chatId}
                                        socket={socket}
                                    />
                                )}
                                <div ref={endOfMessagesRef} />
                            </div>
                            <MessageInput
                                newMessage={newMessage}
                                setNewMessage={setNewMessage}
                                chatId={chatId}
                            />
                            <ToastContainer />
                        </>
                    ) : (
                        <div>Select a chat to start messaging</div>
                    )}
                </div>
            );
        }
    }
};

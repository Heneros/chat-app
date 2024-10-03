import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import MessageList from '@/widgets/MessageList/MessageList';
import socket from '@/widgets/Socket/socket';
import { MessageInput } from '@/widgets/MessageInput/MessageInput';

interface ChatRoomProps {
    selectedChat: ChatType;
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

            const endOfMessagesRef = useRef(null);
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
                                    />
                                )}
                                <div ref={endOfMessagesRef} />
                            </div>
                            <MessageInput
                                newMessage={newMessage}
                                setNewMessage={setNewMessage}
                                chatId={chatId}
                            />
                        </>
                    ) : (
                        <div>Select a chat to start messaging</div>
                    )}
                </div>
            );
        }
    }
};

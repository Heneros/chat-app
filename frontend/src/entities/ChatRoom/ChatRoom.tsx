import React, { useCallback, useEffect, useRef, useState } from 'react';
import { decodeToken } from 'react-jwt';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { ChatType } from '@/shared/types';
import './ChatRoom.css';
import { useGetByIdChatQuery } from '@/features/messages/messagesSlice';
import {
    selectCurrentUserGithubToken,
    selectCurrentUserGoogleToken,
    selectCurrentUserToken,
} from '@/features/auth/auth';
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

export interface DecodedToken {
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
    const tokenGoogle = useAppSelector(selectCurrentUserGoogleToken);
    const tokenGithub = useAppSelector(selectCurrentUserGithubToken);
    
    const token: string | undefined = tokenArray;
    const tokenSecondGoogle: string | null = tokenGoogle;

    const [allMessages, setAllMessages] = useState<Message[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        if (token || tokenSecondGoogle || tokenGithub) {
            const decodedToken = token
                ? decodeToken<DecodedToken>(token)
                : null;
            const decodedTokenGoogle = tokenSecondGoogle
                ? decodeToken<DecodedToken>(tokenSecondGoogle)
                : null;

            const decodedTokenGithub = tokenGithub
                ? decodeToken<DecodedToken>(tokenGithub)
                : null;

            if (decodedToken && decodedToken.id) {
                setUserId(decodedToken.id);
            } else if (decodedTokenGoogle && decodedTokenGoogle.id) {
                setUserId(decodedTokenGoogle.id);
            } else if (decodedTokenGithub && decodedTokenGithub.id) {
                setUserId(decodedTokenGithub.id);
            }
        }
    }, [token, tokenSecondGoogle]);

    useEffect(() => {
        if (userId && chatId) {
            socket.emit('authenticate', userId);
            socket.emit('leave_room', socket.previousRoom);

            const data = {
                userId,
                chatId,
            };
            socket.emit('join_room', data);

            socket.previousRoom = chatId;
        }
    }, [userId, chatId]);

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
            socket.on(`receiveMessage:${chatId}`, handleReceiveMessage);

            const handleMessageUpdated = ({
                messageId,
                newText,
            }: {
                messageId: string;
                newText: string;
            }) => {
                setAllMessages((prevMessages) =>
                    prevMessages.map((msg) =>
                        msg._id === messageId ? { ...msg, text: newText } : msg,
                    ),
                );
            };

            socket.on('messageUpdated', handleMessageUpdated);

            return () => {
                socket.off(`receiveMessage:${chatId}`, handleReceiveMessage);
                socket.off('messageUpdated', handleMessageUpdated);
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
                    <ChatHeader selectedChat={selectedChat} chatId={chatId} />
                    <div className="messageContainer">
                        {isLoading ? (
                            <>Loading...</>
                        ) : error ? (
                            <div>{getErrorMessage(error)}</div>
                        ) : (
                            <MessageList
                                allMessages={allMessages}
                                userId={userId!}
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
};

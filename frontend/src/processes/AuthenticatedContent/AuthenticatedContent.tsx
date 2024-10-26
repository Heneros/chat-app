import React, { useState, useEffect, useCallback } from 'react';
import { getErrorMessage } from 'shared/utils/getErrorMessage';
import {
    useGetAllChatQuery,
    useSearchChatQuery,
} from '@/features/messages/messagesSlice';
import { ChatType } from '@/shared/types';
import { Chat } from '@/widgets/Chats/Chat/Chat';

interface AuthenticatedContentProps {
    setSelectedChat: (chat: any) => void;
    searchTerm: string;
}
export const AuthenticatedContent: React.FC<AuthenticatedContentProps> = ({
    setSelectedChat,
    searchTerm,
}) => {
    const [recentMessages, setRecentMessages] = useState<{
        [chatId: string]: string;
    }>({});

    const {
        data: searchResults,
        isLoading: isSearching,
        error: searchError,
    } = useSearchChatQuery(searchTerm, { skip: !searchTerm });

    const {
        data: allChats,
        isLoading,
        error,
    } = useGetAllChatQuery(undefined, {
        skip: !!searchTerm,
        pollingInterval: 3000,
    });

    if (isLoading || isSearching) return <div>Loading...</div>;
    if (error || searchError) {
        return (
            <div>
                Error: {getErrorMessage(error) || getErrorMessage(searchError)}
            </div>
        );
    }

    const chats = searchTerm ? searchResults : allChats?.messages;

    return chats.length > 0 ? (
        chats.map((chat: ChatType) => {
            const lastMessage =
                recentMessages[chat._id] || chat.messages.slice(-1)[0]?.text;
            return (
                <Chat
                    key={chat._id}
                    {...chat}
                    onClick={() => setSelectedChat(chat)}
                    setSelectedChat={setSelectedChat}
                    lastMessage={lastMessage}
                />
            );
        })
    ) : (
        <div>No messages found</div>
    );
};

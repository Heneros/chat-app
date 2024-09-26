import React from 'react';
import { getErrorMessage } from 'shared/utils/getErrorMessage';

import {
    useGetAllChatQuery,
    useSearchChatQuery,
} from '../../redux/slices/messagesSlice';

interface AuthenticatedContentProps {
    setSelectedChat: (chat: any) => void;
    searchTerm: string;
}

export const AuthenticatedContent: React.FC<AuthenticatedContentProps> = ({
    setSelectedChat,
    searchTerm,
}) => {
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
    if (error || searchError)
        return (
            <div>
                Error: {getErrorMessage(error) || getErrorMessage(searchError)}
            </div>
        );

    const chats = searchTerm ? searchResults : allChats?.messages;

    return chats.length > 0 ? (
        chats.map((chat, index) => {
            const firstThreeMessages = chat.messages
                .slice(0, 3)
                .map((message) => message.text);
            return (
                <Chat
                    key={index}
                    {...chat}
                    onClick={() => setSelectedChat(chat)}
                    setSelectedChat={setSelectedChat}
                    firstThreeMessages={firstThreeMessages}
                />
            );
        })
    ) : (
        <div>No messages found</div>
    );
};

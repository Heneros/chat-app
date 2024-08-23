import React from 'react';
import { Chat } from '../Chat/Chat';
import { useGetAllChatQuery } from '../../redux/slices/messagesSlice';

export const AuthenticatedContent = ({ setSelectedChat }) => {
    const { data, isLoading, error } = useGetAllChatQuery(undefined, {
        pollingInterval: 3000,
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <>
            {data ? (
                data.messages.map((chat, index) => (
                    <Chat
                        key={index}
                        {...chat}
                        onClick={() => setSelectedChat(chat)}
                    />
                ))
            ) : (
                <div>No messages found</div>
            )}
        </>
    );
};

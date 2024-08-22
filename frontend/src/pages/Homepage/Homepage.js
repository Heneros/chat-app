import React from 'react';
import './Homepage.css';
import { Chat } from '../../components/Chat/Chat';
import { TopBar } from '../../components/TopBar/TopBar';
import { useGetAllChatQuery } from '../../redux/slices/messagesSlice';

export const Homepage = () => {
    const { data, isLoading, error } = useGetAllChatQuery(undefined, {
        pollingInterval: 1500,
    });

    // console.log(data);
    return (
        <div className="parent">
            <div className="left-side">
                <TopBar />
                {isLoading && <>Loading...</>}
                {/* {error && <>Error: {error.message}</>} */}
                {data &&
                    data?.messages.map((chat, index) => (
                        <Chat
                            key={index}
                            firstName={chat.firstName}
                            lastName={chat.lastName}
                            messages={chat.messages}
                        />
                    ))}
            </div>
            <div className="right-side">right-side</div>
        </div>
    );
};

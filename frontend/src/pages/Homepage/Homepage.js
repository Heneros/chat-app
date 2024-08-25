import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import './Homepage.css';
import { TopBar } from '../../components/TopBar/TopBar';
import { selectCurrentUserToken } from '../../redux/slices/auth';
import { AuthenticatedContent } from '../../components/AuthenticatedContent/AuthenticatedContent';
import { ChatRoom } from '../../components/ChatRoom/ChatRoom';

export const Homepage = () => {
    const token = useSelector(selectCurrentUserToken);
    const [selectedChat, setSelectedChat] = useState(null);


    return (
        <div className="parent">
            <div className="left-side">
                <TopBar />
                {token ? (
                    <AuthenticatedContent setSelectedChat={setSelectedChat} />
                ) : (
                    <span>Please log in</span>
                )}
            </div>
            <div className="right-side">
                {token ? (
                    <ChatRoom selectedChat={selectedChat} />
                ) : (
                    <span>Please log in</span>
                )}
            </div>
        </div>
    );
};

import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import './Homepage.css';
import { TopBar } from '../../components/TopBar/TopBar';
import { selectCurrentUserToken } from '../../features/auth/auth';
import { AuthenticatedContent } from '../../components/AuthenticatedContent/AuthenticatedContent';
import { ChatRoom } from '../../components/ChatRoom/ChatRoom';

export const Homepage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedChat, setSelectedChat] = useState(null);

    const token = useSelector(selectCurrentUserToken);

    return (
        <div className="parent">
            <div className="left-side">
                <TopBar setSearchTerm={setSearchTerm} />
                {token ? (
                    <AuthenticatedContent
                        searchTerm={searchTerm}
                        setSelectedChat={setSelectedChat}
                    />
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

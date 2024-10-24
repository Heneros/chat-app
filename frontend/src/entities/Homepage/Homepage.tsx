import React, { useState } from 'react';

import './Homepage.css';
import {
    selectCurrentUserGoogleToken,
    selectCurrentUserToken,
} from '@/features/auth/auth';
import { TopBar } from '@/widgets/TopBar/TopBar';
import { AuthenticatedContent } from '@/processes/AuthenticatedContent/AuthenticatedContent';
import { ChatRoom } from '../ChatRoom/ChatRoom';
import { ChatType } from '@/shared/types';
import { useAppSelector } from '@/shared/lib/store';

export const Homepage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedChat, setSelectedChat] = useState<ChatType | null>(null);

    const token = useAppSelector(selectCurrentUserToken);
    const tokenGoogle = useAppSelector(selectCurrentUserGoogleToken);
    // console.log(tokenGoogle);
    return (
        <div className="parent">
            <div className="left-side">
                <TopBar setSearchTerm={setSearchTerm} />
                {token || tokenGoogle ? (
                    <AuthenticatedContent
                        searchTerm={searchTerm}
                        setSelectedChat={setSelectedChat}
                    />
                ) : (
                    <span>Please log in</span>
                )}
            </div>
            <div className="right-side">
                {token || tokenGoogle ? (
                    selectedChat ? (
                        <ChatRoom selectedChat={selectedChat} />
                    ) : (
                        <span>Select Message</span>
                    )
                ) : (
                    <span>Please login</span>
                )}
            </div>
        </div>
    );
};

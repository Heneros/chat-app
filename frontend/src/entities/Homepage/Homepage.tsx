import React, { useEffect, useState } from 'react';

import './Homepage.css';
import {
    isTokenValid,
    selectCurrentUserGithubToken,
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
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const token = useAppSelector(selectCurrentUserToken);
    const tokenGoogle = useAppSelector(selectCurrentUserGoogleToken);
    const tokenGithub = useAppSelector(selectCurrentUserGithubToken);

    // console.log(tokenGithub);
    useEffect(() => {
        if (
            isTokenValid(token!) ||
            isTokenValid(tokenGoogle) ||
            isTokenValid(tokenGithub)
        ) {
            setIsAuthenticated(true);
            //  console.log('setIsAuthenticated(true)');
        } else {
            setIsAuthenticated(false);
            console.log('setIsAuthenticated(false)');
        }
    }, [token, tokenGoogle, tokenGithub]);
    // console.log(tokenGoogle);
    return (
        <div className="parent">
            <div className="left-side">
                <TopBar setSearchTerm={setSearchTerm} />
                {isAuthenticated ? (
                    <AuthenticatedContent
                        searchTerm={searchTerm}
                        setSelectedChat={setSelectedChat}
                    />
                ) : (
                    <span>Please log in</span>
                )}
            </div>
            <div className="right-side">
                {isAuthenticated ? (
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

import React, { useEffect, useState } from 'react';
import { decodeToken } from 'react-jwt';

import styles from './Homepage.module.css';

import {
    selectCurrentUserGithubToken,
    selectCurrentUserGoogleToken,
    selectCurrentUserToken,
    selectIsAuthenticated,
    setAuthenticated,
} from '@/features/auth/auth';
import { TopBar } from '@/widgets/TopBar/TopBar';
import { AuthenticatedContent } from '@/processes/AuthenticatedContent/AuthenticatedContent';
import { ChatRoom } from '../ChatRoom/ChatRoom';
import { ChatType } from '@/shared/types';
import { useAppDispatch, useAppSelector } from '@/shared/lib/store';

export const Homepage = () => {
    console.log(styles);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedChat, setSelectedChat] = useState<ChatType | null>(null);

    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const dispatch = useAppDispatch();

    const tokenArray = useAppSelector(selectCurrentUserToken);
    const tokenGithubArray = useAppSelector(selectCurrentUserGoogleToken);
    const tokenGoogleArray = useAppSelector(selectCurrentUserGithubToken);

    // console.log(tokenGithub);
    useEffect(() => {
        const token: string | null = tokenArray ?? null;
        const tokenGithub: string | null = tokenGithubArray ?? null;
        const tokenGoogle: string | null = tokenGoogleArray ?? null;

        const decodedToken = token ? decodeToken(token) : null;
        // console.log(decodedToken);
        const decodedGithubToken = tokenGithub
            ? decodeToken(tokenGithub)
            : null;
        const decodedGoogleToken = tokenGoogle
            ? decodeToken(tokenGoogle)
            : null;

        if (decodedToken || decodedGithubToken || decodedGoogleToken) {
            dispatch(setAuthenticated(true));
        } else {
            dispatch(setAuthenticated(false));
        }
    }, [tokenArray, tokenGithubArray, tokenGoogleArray]);

    if (!styles) {
        return <div>Loading1...</div>;
    }

    return (
        <div className={styles.parent}>
            <div className={styles.leftSide}>
                <TopBar setSearchTerm={setSearchTerm} />
                {isAuthenticated ? (
                    <AuthenticatedContent
                        searchTerm={searchTerm}
                        setSelectedChat={setSelectedChat}
                    />
                ) : (
                    <span>Please Log In</span>
                )}
            </div>
            <div className={styles.rightSide}>
                {isAuthenticated ? (
                    selectedChat ? (
                        <ChatRoom selectedChat={selectedChat} />
                    ) : (
                        <span>Select Message</span>
                    )
                ) : (
                    <span>Please Log In</span>
                )}
            </div>
        </div>
    );
};

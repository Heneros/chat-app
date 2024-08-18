import React from 'react';
import './Homepage.css';
import { Chat } from '../../components/Chat/Chat';
import { TopBar } from '../../components/TopBar/TopBar';

export const Homepage = () => {
    return (
        <div className="parent">
            <div className="left-side">
                <TopBar />
                <Chat />
            </div>
            <div className="right-side">right-side</div>
        </div>
    );
};

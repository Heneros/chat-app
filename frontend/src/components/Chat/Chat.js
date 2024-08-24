import React from 'react';
import './Chat.css';

export const Chat = ({ firstName, lastName, onClick }) => {
    return (
        <>
            <div className="chat-member" onClick={onClick}>
                <div className="chat-member__wrapper" data-online="true">
                    <div className="chat-member__avatar">
                        <img
                            src="https://randomuser.me/api/portraits/thumb/women/56.jpg"
                            alt={`${firstName} ${lastName}`}
                        />
                        <div className="user-status user-status--large"></div>
                    </div>
                    <div className="chat-member__details">
                        <span className="chat-member__name">
                            {firstName} {lastName}
                        </span>
                        <span className="chat-member__status">Online</span>
                    </div>
                </div>
            </div>
        </>
    );
};

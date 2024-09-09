import React from 'react';
import './Chat.css';
import { useDeleteChatMutation } from '../../redux/slices/messagesSlice';

export const Chat = ({
    firstName,
    lastName,
    onClick,
    _id,
    setSelectedChat,
}) => {
    const [deleteChat, { isLoading, error }] = useDeleteChatMutation();
    const deleteChatFunction = async (chatId) => {
        try {
            if (window.confirm('Delete this chat?')) {
                await deleteChat(chatId).unwrap();
                setSelectedChat(null);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
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
                {isLoading ? (
                    <span>Deleting...</span>
                ) : error ? (
                    <span>Error: {error.message}</span>
                ) : (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            deleteChatFunction(_id);
                        }}
                    >
                        Delete
                    </button>
                )}
            </div>
        </div>
    );
};

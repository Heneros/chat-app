import React from 'react';
import './Chat.css';
import { getErrorMessage } from 'shared/utils/getErrorMessage';
import { ChatType } from 'shared/types';
import { useDeleteChatMutation } from '@/features/messages/messagesSlice';

export const Chat: React.FC<ChatType> = ({
    firstName,
    lastName,
    onClick,
    lastMessage,
    _id,
    setSelectedChat,
}) => {
    const [deleteChat, { isLoading, error }] = useDeleteChatMutation();
    const deleteChatFunction = async (chatId: string) => {
        try {
            if (window.confirm('Delete this chat?')) {
                await deleteChat(chatId).unwrap();
                //    setSelectedChat?.(null);
                setSelectedChat?.(null);
            }
        } catch (error) {
            console.error(error);
        }
    };

    // console.log(firstName);
    return (
        <div className="chat-member" onClick={onClick}>
            <div className="chat-member__wrapper" data-online="true">
                <div className="chat-member__avatar">
                    <img
                        src="https://randomuser.me/api/portraits/thumb/women/56.jpg"
                        alt={`${firstName} ${lastName}`}
                    />
                    <div className="user-status"></div>
                </div>
                <div className="chat-member__details">
                    <span className="chat-member__name">
                        {firstName} {lastName}
                    </span>
                    <span className="chat-member__last-message">
                        {lastMessage}
                    </span>
                </div>
                {isLoading ? (
                    <span>Deleting...</span>
                ) : error ? (
                    <span>Error: {getErrorMessage(error) as string}</span>
                ) : (
                    <button
                        type="submit"
                        className="delete-button"
                        onClick={(e) => {
                            e.stopPropagation();
                            deleteChatFunction(_id);
                        }}
                    >
                        &times;
                    </button>
                )}
            </div>
        </div>
    );
};

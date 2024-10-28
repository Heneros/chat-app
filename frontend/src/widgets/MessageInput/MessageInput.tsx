import React, { useState } from 'react';
import { useSendMessageToChatMutation } from '@/features/messages/messagesSlice';
import socket from '../Socket/socket';
import { useSendImageMutation } from '@/features/uploadImage/uploadImage';

interface MessageInputProps {
    newMessage: string;
    setNewMessage: (message: string) => void;
    chatId: string;
}

export const MessageInput: React.FC<MessageInputProps> = ({
    newMessage,
    setNewMessage,
    chatId,
}) => {
    const [sendMessage] = useSendMessageToChatMutation();
    const [imageUrl, setImageUrl] = useState<string | undefined>();
    const [uploadImage] = useSendImageMutation();
    const handleSendMessage = async () => {
        ///     if (newMessage.trim() === '' || !chatId) return;
        if ((newMessage.trim() === '' && !imageUrl) || !chatId) return;

        try {
            await sendMessage({
                chatId,
                message: newMessage,
                imageUrl,
            }).unwrap();
            socket.emit('sendMessage', { chatId, text: newMessage, imageUrl });
            setNewMessage('');
            // setImageUrl('');
            setImageUrl(undefined);
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    const uploadFileHandler = async (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        if (!e.target.files || e.target.files.length === 0) {
            console.log('No file selected');
            return;
        }

        try {
            const imageFile = e.target.files[0];
            const res = await uploadImage({ imageFile }).unwrap();
            setImageUrl(res.image);
            //      console.log(res.image);
        } catch (error) {
            console.log('Error uploading image', error);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleSendMessage();
        }
        // handleSendMessage();
    };

    return (
        <div className="message-input">
            <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                onKeyDown={handleKeyDown}
            />
            <label htmlFor="file pload" className="file-label">
                Test
                <input
                    type="file"
                    id="file-upload"
                    onChange={uploadFileHandler}
                    className="file-input"
                />
                {imageUrl && (
                    <div className="preview">
                        <p>Image Preview:</p>
                        <img
                            src={imageUrl}
                            alt="Preview"
                            className="preview-img"
                        />
                    </div>
                )}
            </label>

            <button type="submit" onClick={handleSendMessage}>
                Send
            </button>
        </div>
    );
};

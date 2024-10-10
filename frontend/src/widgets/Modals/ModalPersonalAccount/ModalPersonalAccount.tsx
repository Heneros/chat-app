import React, { useEffect, useState } from 'react';

import { ChatModal } from '@/shared/types';
import { BASE_URL } from '@/shared/utils/constants';
import socket from '@/widgets/Socket/socket';

const ModalPersonalAccount: React.FC<ChatModal> = ({ isOpen, onClose }) => {
    // const [socket, setSocket] = useState(null);
    const [automatedMessages, setAutomatedMessages] = useState(true);

    useEffect(() => {
        socket.on('connect', () => {
            console.log('Connected to server');
        });

        socket.on(`receiveMessage:randomRoomId`, (message) => {
            if (automatedMessages || message.sender !== 'api') {
                console.log('Received message:', message.text);
            }
        });

        return () => {
            socket.off('receiveMessage:randomRoomId');
        };
    }, [automatedMessages]);

    const toggleAutomatedMessages = () => {
        const newState = !automatedMessages;
        setAutomatedMessages(newState);
        socket.emit('toggleAutomatedMessages', newState);
        /// console.log('toggleAutomatedMessages');
    };
    if (!isOpen) return null;
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h2>Personal Account</h2>
                <button type="button" onClick={toggleAutomatedMessages}>
                    {automatedMessages ? 'Turn off' : 'Turn on'}
                </button>

                <button type="submit" className="btn-close" onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    );
};

export default ModalPersonalAccount;

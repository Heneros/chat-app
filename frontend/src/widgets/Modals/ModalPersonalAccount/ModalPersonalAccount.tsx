import React, { useEffect, useState } from 'react';
import { decodeToken } from 'react-jwt';

import { ChatModal } from '@/shared/types';
import { BASE_URL } from '@/shared/utils/constants';
import socket from '@/widgets/Socket/socket';
import { useAppSelector } from '@/shared/lib/store';
import { selectCurrentUserToken } from '@/features/auth/auth';

interface DecodedToken {
    id: string;
}

const ModalPersonalAccount: React.FC<ChatModal> = ({ isOpen, onClose }) => {
    // const [socket, setSocket] = useState(null);
    const tokenArray = useAppSelector(selectCurrentUserToken);
    // const [automatedMessages, setAutomatedMessages] = useState(false);
    // const [userId, setUserId] = useState<string | null>(null);
    // console.log(token);

    const [automatedMessages, setAutomatedMessages] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const token: string | undefined = tokenArray;

        if (token) {
            const decodedToken = decodeToken<DecodedToken>(token);

            if (decodedToken) {
                const { id } = decodedToken;
                setUserId(id);
                console.log('', id);
            }
        } else {
            console.log('Nety');
        }
    }, [tokenArray]);

    useEffect(() => {
        if (userId) {
            // socket.emit('authenticate', userId);

            console.log(userId);
            socket.on('authenticationSuccess', (data) => {
                console.log('Authentication successful');
                setAutomatedMessages(data.automatedMessagesEnabled);
            });

            socket.on('automatedMessagesUpdated', (enabled) => {
                setAutomatedMessages(enabled);
            });
        }

        return () => {
            socket.off('authenticationSuccess');
            socket.off('authenticationFailed');
            socket.off('automatedMessagesUpdated');
        };
    }, [userId]);

    const toggleAutomatedMessages = () => {
        const newState = !automatedMessages;
        // setAutomatedMessages(newState);
        socket.emit('toggleAutomatedMessages', newState);
        console.log(`Automatic msgs ${newState ? 'turn on' : 'turn off'}`);
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

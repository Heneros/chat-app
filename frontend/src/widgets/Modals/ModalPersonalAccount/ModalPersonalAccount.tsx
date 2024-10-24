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

    const [automatedMessages, setAutomatedMessages] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const token: string | undefined = tokenArray;

        if (token) {
            const decodedToken = decodeToken<DecodedToken>(token);

            if (decodedToken) {
                const { id } = decodedToken;
                setUserId(id);
                //  console.log('', id);
            }
        }
    }, [tokenArray]);

    useEffect(() => {
        if (userId) {
            socket.emit('authenticate', userId);
            console.log(userId);
        }

        return () => {
            socket.off('authenticationSuccess');
            socket.off('authenticationFailed');
            socket.off('automatedMessagesUpdated');
        };
    }, [userId]);

    const toggleAutomatedMessages = () => {
        const newState = !automatedMessages;
        setAutomatedMessages(newState);
        if (userId) {
            socket.emit('toggleAutomateMessages', {
                userId,
                enabled: newState,
            });
            console.log(
                `Automatic msgs ${newState ? 'turned on' : 'turned off'}`,
            );
        } else {
            console.log('User ID not available');
        }
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

import React, { useEffect, useState, useCallback } from 'react';
import { decodeToken } from 'react-jwt';
import { ChatModal } from '@/shared/types';
import socket from '@/widgets/Socket/socket';
import { useAppSelector } from '@/shared/lib/store';
import {
    selectCurrentUserGithubToken,
    selectCurrentUserGoogleToken,
    selectCurrentUserToken,
} from '@/features/auth/auth';

interface DecodedToken {
    id: string;
}

interface AutomatedMessagesState {
    enabled: boolean;
    loading: boolean;
    error: string | null;
}

const ModalPersonalAccount: React.FC<ChatModal> = ({ isOpen, onClose }) => {
    const tokenArray = useAppSelector(selectCurrentUserToken);
    const tokenGithubArray = useAppSelector(selectCurrentUserGithubToken);
    const tokenGoogleArray = useAppSelector(selectCurrentUserGoogleToken);

    const [userId, setUserId] = useState<string | null>(null);
    const [automatedMessages, setAutomatedMessages] =
        useState<AutomatedMessagesState>({
            enabled: false,
            loading: true,
            error: null,
        });

    // Получение ID пользователя из токена
    useEffect(() => {
        const token: string | null = tokenArray ?? null;
        const tokenGithub: string | null = tokenGithubArray ?? null;
        const tokenGoogle: string | null = tokenGoogleArray ?? null;

        const tokens = [
            { token, type: 'regular' },
            { token: tokenGithub, type: 'github' },
            { token: tokenGoogle, type: 'google' },
        ];

        for (const { token, type } of tokens) {
            if (token) {
                const decoded = decodeToken<DecodedToken>(token);
                if (decoded?.id) {
                    setUserId(decoded.id);
                    break;
                }
            }
        }
    }, [tokenArray, tokenGithubArray, tokenGoogleArray]);

    useEffect(() => {
        if (!userId) return;

        const handleAutomatedMessagesStatus = (status: boolean) => {
            setAutomatedMessages((prev) => ({
                ...prev,
                enabled: status,
                loading: false,
                error: null,
            }));
        };

        const handleError = (error: string) => {
            setAutomatedMessages((prev) => ({
                ...prev,
                loading: false,
                error,
            }));
        };

        socket.emit('getAutomatedMessagesStatus', userId);

 
        socket.on('automatedMessagesStatus', handleAutomatedMessagesStatus);
        socket.on('automatedMessagesError', handleError);
        socket.on('toggleError', handleError);

        return () => {
            socket.off(
                'automatedMessagesStatus',
                handleAutomatedMessagesStatus,
            );
            socket.off('automatedMessagesError', handleError);
            socket.off('toggleError', handleError);
        };
    }, [userId]);


    const toggleAutomatedMessages = useCallback(async () => {
        if (!userId) {
            console.error('User ID not available');
            return;
        }

        setAutomatedMessages((prev) => ({
            ...prev,
            loading: true,
            error: null,
        }));

        socket.emit('toggleAutomateMessages', {
            userId,
            enabled: !automatedMessages.enabled,
        });
    }, [userId, automatedMessages.enabled]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h2>Personal Account</h2>

                {automatedMessages.loading ? (
                    <div>Loading...</div>
                ) : automatedMessages.error ? (
                    <div className="error-message">
                        {automatedMessages.error}
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={toggleAutomatedMessages}
                        disabled={automatedMessages.loading}
                        className={`toggle-button ${automatedMessages.enabled ? 'enabled' : 'disabled'}`}
                    >
                        {automatedMessages.enabled ? 'Turn off' : 'Turn on'}{' '}
                        Automated Messages
                    </button>
                )}

                <button type="submit" className="btn-close" onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    );
};

export default ModalPersonalAccount;

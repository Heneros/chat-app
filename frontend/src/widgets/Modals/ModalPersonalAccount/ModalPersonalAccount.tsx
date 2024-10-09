import React from 'react';

import { ChatModal } from '@/shared/types';

const ModalPersonalAccount: React.FC<ChatModal> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h2>Personal Account</h2>
                {/* <form
                    noValidate
                    autoComplete="off"
                    onSubmit={handleSubmit}
                ></form> */}
                <button type="submit" className="btn-close" onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    );
};

export default ModalPersonalAccount;

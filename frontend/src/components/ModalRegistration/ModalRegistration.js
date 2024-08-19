import React from 'react';

import './ModalRegistration.css';

export const ModalRegistration = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
        <>
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal" onClick={(e) => e.stopPropagation()}>
                    <h2>Registration</h2>
                    <form>
                        <div className="form-group">
                            <label htmlFor="email">First Name</label>
                            <input type="text" id="text" name="text" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Last Name</label>
                            <input type="text" id="text" name="text" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                required
                            />
                        </div>
                        <button type="submit" className="btn-submit">
                            Login
                        </button>
                    </form>
                    <button className="btn-close" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </>
    );
};

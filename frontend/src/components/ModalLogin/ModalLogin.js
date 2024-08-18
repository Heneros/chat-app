import React from 'react';
import './ModalLogin.css';

export const ModalLogin = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
        <>
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal" onClick={(e) => e.stopPropagation()}>
                    <h2>Login</h2>
                    <form>
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

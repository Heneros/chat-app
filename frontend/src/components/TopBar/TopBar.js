import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { FaBars } from 'react-icons/fa';

import './TopBar.css';
import { ModalLogin } from '../ModalLogin/ModalLogin';

export const TopBar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const openModal = () => {
        setIsModalOpen(true);
        setIsMenuOpen(false);
    };
    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <div className="search-bar">
                <div className="trigger" onClick={toggleMenu}>
                    <FaBars className="menu-icon" />
                </div>

                <div className={`menu-adaptive ${isMenuOpen ? 'active' : ''} `}>
                    <ul>
                        <li onClick={openModal}>Login</li>
                        <li>Logout</li>
                    </ul>
                </div>
                <div className="search-container">
                    <FaSearch className="search-icon" />
                    <input type="text" placeholder="Search" />
                </div>
            </div>
            <ModalLogin isOpen={isModalOpen} onClose={closeModal} />
        </>
    );
};

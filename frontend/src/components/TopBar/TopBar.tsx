import React, { useEffect, useRef, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { FaBars } from 'react-icons/fa';

import './TopBar.css';
import { ModalLogin } from '../ModalLogin/ModalLogin';
import { ModalRegistration } from '../ModalRegistration/ModalRegistration';
import { useSelector } from 'react-redux';
import { selectCurrentUserToken } from '../../redux/slices/auth';
import { useLogoutMutation } from '../../redux/slices/userApiSlice';

export const TopBar = ({ setSearchTerm }) => {
    const token = useSelector(selectCurrentUserToken);
    // console.log(token);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalSecondOpen, setIsModalSecondOpen] = useState(false);

    const [logoutUser] = useLogoutMutation();
    const menuRef = useRef();

    const logoutHandler = async () => {
        try {
            await logoutUser().unwrap();
        } catch (error) {
            console.log(error);
        }
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const openModal = () => {
        setIsModalOpen(true);
        setIsMenuOpen(false);
    };

    const openModalSecond = () => {
        setIsModalSecondOpen(true);
        setIsMenuOpen(false);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const closeModalSecond = () => {
        setIsModalSecondOpen(false);
    };
    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                closeMenu();
            }
        };

        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);
    return (
        <>
            <div className="search-bar">
                <div className="trigger" onClick={toggleMenu}>
                    <FaBars className="menu-icon" />
                </div>
                <div
                    ref={menuRef}
                    onClose={closeMenu}
                    className={`menu-adaptive ${isMenuOpen ? 'active' : ''} `}
                >
                    <ul>
                        {!token ? (
                            <>
                                <li onClick={openModal}>Login</li>
                                <li onClick={openModalSecond}>Registration</li>
                            </>
                        ) : (
                            <>
                                <li onClick={logoutHandler}>Logout</li>
                            </>
                        )}
                    </ul>
                </div>
                <div className="search-container">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        className="search-field"
                        placeholder="Search chat..."
                        onChange={handleSearch}
                    />
                </div>
            </div>
            <ModalLogin isOpen={isModalOpen} onClose={closeModal} />
            <ModalRegistration
                isOpen={isModalSecondOpen}
                onClose={closeModalSecond}
            />
        </>
    );
};

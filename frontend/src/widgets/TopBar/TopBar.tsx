import React, { useEffect, useRef, useState } from 'react';
import { FaSearch, FaBars } from 'react-icons/fa';

import './TopBar.css';

import { useLogoutMutation } from '@/features/user/userApiSlice';
import {
    selectCurrentUserToken,
    selectCurrentUserGoogleToken,
} from '@/features/auth/auth';
// import { ChatModal } from '@/shared/types';
import { useAppSelector } from '@/shared/lib/store';
import ModalCreateChat from '../Modals/ModalCreateChat/ModalCreateChat';
import { ModalRegistration } from '../Modals/ModalRegistration/ModalRegistration';
import { ModalLogin } from '../Modals/ModalLogin/ModalLogin';
import ModalPersonalAccount from '../Modals/ModalPersonalAccount/ModalPersonalAccount';

interface ChatModalProps {
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

export const TopBar: React.FC<ChatModalProps> = ({ setSearchTerm }) => {
    const token = useAppSelector(selectCurrentUserToken);
    const tokenGoogle = useAppSelector(selectCurrentUserGoogleToken);
    console.log(tokenGoogle);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalSecondOpen, setIsModalSecondOpen] = useState(false);
    const [isModalThirdOpen, setIsModalThirdOpen] = useState(false);
    const [isModalFourOpen, setIsModalFourOpen] = useState(false);

    const [logoutUser] = useLogoutMutation();
    // const menuRef = useRef();
    const menuRef = useRef<HTMLDivElement | null>(null);

    const logoutHandler = async () => {
        try {
            await logoutUser(undefined).unwrap();
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

    const openModalThird = () => {
        setIsModalThirdOpen(true);
        setIsMenuOpen(false);
    };

    const openModalFour = () => {
        setIsModalFourOpen(true);
        setIsMenuOpen(false);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const closeModalSecond = () => {
        setIsModalSecondOpen(false);
    };

    const closeModalThird = () => {
        setIsModalThirdOpen(false);
    };
    const closeModalFour = () => {
        setIsModalFourOpen(false);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
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
                    // onClose={closeMenu}
                    className={`menu-adaptive ${isMenuOpen ? 'active' : ''} `}
                >
                    <ul>
                        {!token && !tokenGoogle ? (
                            <>
                                <button type="button" onClick={openModal}>
                                    Login
                                </button>
                                <button type="button" onClick={openModalSecond}>
                                    Registration
                                </button>
                            </>
                        ) : (
                            <>
                                <button type="button" onClick={openModalThird}>
                                    Create Chat
                                </button>
                                <button type="button" onClick={openModalFour}>
                                    My Account
                                </button>
                                <button type="button" onClick={logoutHandler}>
                                    Logout
                                </button>
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
            <ModalCreateChat
                isOpen={isModalThirdOpen}
                onClose={closeModalThird}
            />
            <ModalPersonalAccount
                isOpen={isModalFourOpen}
                onClose={closeModalFour}
            />
        </>
    );
};

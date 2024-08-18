import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

export const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    return (
        <header className="header">
            <div className="col-6">
                <Link to={'/'} className="logo">
                    Chat App
                </Link>
            </div>
            <div className="col-6">
                <nav className={`nav ${isMenuOpen ? 'active' : ''}`}>
                    <ul className="menu">
                        <li>
                            <Link to={'/login'}>Login</Link>
                        </li>
                        <li>
                            <Link>Logout</Link>
                        </li>
                    </ul>
                </nav>

                <div className="menu-icon" onClick={toggleMenu}>
                    &#9776;
                </div>
            </div>
        </header>
    );
};

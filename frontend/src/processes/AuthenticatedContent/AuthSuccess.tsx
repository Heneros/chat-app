import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthSuccess = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (token) {
            localStorage.setItem('googleToken', token);
            navigate('/');
        } else {
            console.log('googleToken error');
        }
    }, [navigate]);

    return <div>Loading... Wait please</div>;
};

export default AuthSuccess;

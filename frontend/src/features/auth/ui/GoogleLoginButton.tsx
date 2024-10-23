import React from 'react';
import { AUTH_GOOGLE } from '@/shared/utils/constants';

const GoogleLoginButton = () => {
    const google = () => {
        window.open('http://localhost:4000/api/v1/users/google', '_self');
    };
    const handleGoogleRedirect = async () => {
        const response = await fetch(
            'http://localhost:4000/api/v1/users/google/redirect',
            {
                method: 'GET',
                credentials: 'include', // это необходимо для передачи cookies
            },
        );
        const data = await response.json();
        if (data.token) {
            localStorage.setItem('googleToken', data.token);
            window.location.href = 'http://localhost:3000'; // перенаправляем на фронт после логина
        } else {
            console.error('Error fetching the token');
        }
    };

    return (
        <button onClick={google} type="button">
            Google btn
        </button>
    );
};

export default GoogleLoginButton;

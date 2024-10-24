import React from 'react';

const GoogleLoginButton = () => {
    const google = () => {
        window.open('http://localhost:4000/api/v1/users/google', '_self');
    };

    return (
        <button onClick={google} type="button">
            Google btn
        </button>
    );
};

export default GoogleLoginButton;

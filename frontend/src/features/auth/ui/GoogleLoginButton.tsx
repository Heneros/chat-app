import React from 'react';
import { BASE_URL } from '@/shared/utils/constants';

const GoogleLoginButton = () => {
    const google = () => {
        window.open(`${BASE_URL}/api/v1/users/google`, '_self');
    };

    return (
        <button onClick={google} type="button">
            Google btn
        </button>
    );
};

export default GoogleLoginButton;

import React from 'react';
import { BASE_URL } from '@/shared/utils/constants';

const GithubLoginButton = () => {
    const github = () => {
        window.open(`${BASE_URL}/api/v1/users/github`, '_self');
    };
    return (
        <button onClick={github} type="button">
            Github btn
        </button>
    );
};

export default GithubLoginButton;

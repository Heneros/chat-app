import React from 'react';

const GithubLoginButton = () => {
    const github = () => {
        window.open('http://localhost:4000/api/v1/users/github', '_self');
    };
    return (
        <button onClick={github} type="button">
            Github btn
        </button>
    );
};

export default GithubLoginButton;

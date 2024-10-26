import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    selectCurrentUserGoogleToken,
    updateGithubToken,
    updateGoogleToken,
} from '@/features/auth/auth';
import { useAppDispatch, useAppSelector } from '@/shared/lib/store';

const AuthSuccess = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const tokenGoogle = urlParams.get('tokenGoogle');
        const tokenGithub = urlParams.get('tokenGithub');
        if (tokenGoogle) {
            localStorage.setItem('googleToken', tokenGoogle);
            dispatch(updateGoogleToken(tokenGoogle));
            navigate('/');
        } else if (tokenGithub) {
            localStorage.setItem('githubToken', tokenGithub);
            dispatch(updateGithubToken(tokenGithub));
            navigate('/');
        } else {
            console.log('token error');
        }
    }, [dispatch, navigate]);

    return <div>Loading... Wait please</div>;
};

export default AuthSuccess;

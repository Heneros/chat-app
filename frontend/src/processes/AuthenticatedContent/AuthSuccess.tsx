import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    isTokenValid,
    updateGithubToken,
    updateGoogleToken,
} from '@/features/auth/auth';
import { useAppDispatch, useAppSelector } from '@/shared/lib/store';
import axios from 'axios';

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
            //   } else if (tokenGithub && isTokenValid(tokenGithub)) {
        } else if (tokenGithub) {
            localStorage.setItem('githubToken', tokenGithub);
            dispatch(updateGithubToken(tokenGithub));
            if (isTokenValid(tokenGithub)) {
                navigate('/');
                axios.defaults.headers.common['Authorization'] =
                    `Bearer ${tokenGithub}`;
            } else {
                console.log(' githubToken token error');
            }
        } else {
            console.log('token error');
        }
    }, [dispatch, navigate]);

    return <div>Loading... Wait please</div>;
};

export default AuthSuccess;

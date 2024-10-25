import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    selectCurrentUserGoogleToken,
    updateGoogleToken,
} from '@/features/auth/auth';
import { useAppDispatch, useAppSelector } from '@/shared/lib/store';

const AuthSuccess = () => {
    const dispatch = useAppDispatch();
    const googleToken = useAppSelector(selectCurrentUserGoogleToken);
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (token) {
            localStorage.setItem('googleToken', token);
            dispatch(updateGoogleToken(token));
            navigate('/');
        } else {
            console.log('googleToken error');
        }
    }, [dispatch, navigate]);

    return <div>Loading... Wait please</div>;
};

export default AuthSuccess;

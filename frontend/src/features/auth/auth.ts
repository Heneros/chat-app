import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { decodeToken } from 'react-jwt';

import { User } from '@/shared/types';

const userLocaleStor = localStorage.getItem('user') || null;
const googleToken = localStorage.getItem('googleToken');

let user: User | null = null;

if (userLocaleStor) {
    try {
        user = JSON.parse(userLocaleStor);
    } catch (error) {
        console.error('Error parsing user data:', error);
    }
}

const decodedToken: User | null = googleToken ? decodeToken(googleToken) : null;

interface AuthSlice {
    user: User | null;
    googleToken: string | null;
}

const initialState: AuthSlice = {
    user:
        user ||
        (decodedToken && typeof decodedToken === 'object'
            ? decodedToken
            : null),
    googleToken: googleToken ? googleToken : null,
};

const userSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logIn: (
            state,
            action: PayloadAction<{ user: User; googleToken: string }>,
        ) => {
            const { user, googleToken } = action.payload;
            state.user = user;
            state.googleToken = googleToken;

            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('googleToken', googleToken);
        },
        logout: (state) => {
            state.user = null;
            state.googleToken = null;
            localStorage.clear();
            // localStorage.removeItem('user');
        },
        updateGoogleToken: (state, action: PayloadAction<string>) => {
            state.googleToken = action.payload;
            localStorage.setItem('googleToken', action.payload);
        },
    },
});

export const { logIn, logout, updateGoogleToken } = userSlice.actions;
export const authReducer = userSlice.reducer;
export const selectCurrentUserToken = (state: {
    auth: AuthSlice;
}): string | undefined => {
    const token = state.auth.user?.accessToken;
    return Array.isArray(token) ? token[0] : token;
};

export const selectCurrentUserGoogleToken = (state: {
    auth: AuthSlice;
}): string | null => {
    return state.auth.googleToken;
};

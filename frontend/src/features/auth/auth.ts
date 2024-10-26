import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { decodeToken, isExpired } from 'react-jwt';

import { User } from '@/shared/types';

const userLocaleStor = localStorage.getItem('user');
const googleToken = localStorage.getItem('googleToken');
const githubToken = localStorage.getItem('githubToken');

let user: User | null = null;

if (userLocaleStor) {
    try {
        user = JSON.parse(userLocaleStor);
    } catch (error) {
        console.error('Error parsing user data:', error);
    }
}

interface AuthSlice {
    user: User | null;
    googleToken: string | null;
    githubToken: string | null;
}

const initialState: AuthSlice = {
    user,
    googleToken: googleToken ?? null,
    githubToken: githubToken ?? null,
};

const userSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logIn: (state, action: PayloadAction<{ user: User }>) => {
            const { user } = action.payload;
            state.user = user;

            localStorage.setItem('user', JSON.stringify(user));
        },
        logout: (state) => {
            state.user = null;
            state.googleToken = null;
            state.githubToken = null;
            localStorage.clear();
        },
        updateGoogleToken: (state, action: PayloadAction<string>) => {
            state.googleToken = action.payload;
            localStorage.setItem('googleToken', action.payload);
        },
        updateGithubToken: (state, action: PayloadAction<string>) => {
            state.githubToken = action.payload;
            localStorage.setItem('githubToken', action.payload);
        },
    },
});

export const { logIn, logout, updateGoogleToken, updateGithubToken } =
    userSlice.actions;
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

export const selectCurrentUserGithubToken = (state: {
    auth: AuthSlice;
}): string | null => {
    return state.auth.githubToken;
};

export const isTokenValid = (token: string | null): boolean => {
    return token ? !isExpired(token) : false;
};

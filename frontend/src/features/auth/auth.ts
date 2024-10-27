import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { decodeToken, isExpired } from 'react-jwt';

import { User } from '@/shared/types';

interface AuthSlice {
    isAuthenticated: boolean;
    user: User | null;
    googleToken: string | null;
    githubToken: string | null;
}

const userToken = localStorage.getItem('user');
const googleToken = localStorage.getItem('googleToken');
const githubToken = localStorage.getItem('githubToken');

let parsedUser: User | null = null;
try {
    parsedUser = userToken ? JSON.parse(userToken) : null;
} catch (e) {
    console.error('Error parsing stored user:', e);
}


const isAuthenticated = !!(
    (userToken && !isExpired(userToken)) ||
    (googleToken && !isExpired(googleToken)) ||
    (githubToken && !isExpired(githubToken))
);

const initialState: AuthSlice = {
    isAuthenticated,
    user: parsedUser,
    googleToken: googleToken ?? null,
    githubToken: githubToken ?? null,
};
const userSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuthenticated(state, action: PayloadAction<boolean>) {
            state.isAuthenticated = action.payload;
        },
        logIn: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
            state.isAuthenticated = true;

            localStorage.setItem('user', JSON.stringify(action.payload));
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

export const {
    logIn,
    logout,
    updateGoogleToken,
    updateGithubToken,
    setAuthenticated,
} = userSlice.actions;
export const authReducer = userSlice.reducer;

export const selectIsAuthenticated = (state: { auth: AuthSlice }) =>
    state.auth.isAuthenticated;

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

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/shared/types';
// import { decodeToken } from 'react-jwt';
let userLocaleStor = localStorage.getItem('user') || '';

let user: User | null = null;
if (user) {
    try {
        user = JSON.parse(userLocaleStor);
    } catch (error) {
        console.error('Error parsing user data:', error);
    }
}

interface AuthSlice {
    user: User | null;
}

const initialState = {
    user,
    data: null,
    status: 'loading',
};

const userSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logIn: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
            localStorage.setItem('user', JSON.stringify(action.payload));
        },
        logout: (state) => {
            state.user = null;
            localStorage.clear();
        },
    },
});

export const { logIn, logout } = userSlice.actions;
export const selectCurrentUserToken = (state: { auth: AuthSlice }) =>
    state.auth.user?.accessToken;
export const authReducer = userSlice.reducer;

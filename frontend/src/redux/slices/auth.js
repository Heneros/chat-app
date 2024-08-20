import { createSlice } from '@reduxjs/toolkit';
// import { decodeToken } from 'react-jwt';

const user = JSON.parse(localStorage.getItem('user'));

const initialState = {
    user: user,
    data: null,
    status: 'loading',
};
const userSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logIn: (state, action) => {
            state.user = action.payload;
            localStorage.setItem('user', JSON.stringify(action.payload));
        },
        logout: (state, action) => {
            state.user = null;
            localStorage.clear();
        },
    },
});

export const { logIn, logout } = userSlice.actions;
export const selectCurrentUserToken = (state) => state.auth.user?.accessToken;
export const authReducer = userSlice.reducer;

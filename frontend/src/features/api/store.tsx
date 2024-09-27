import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './apiSlice';
import { authReducer } from '@/features/auth/auth';

const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
});

export default store;

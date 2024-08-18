import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
    reducer: {},
    // middleware: (getDefaultMiddleware) =>
    //     getDefaultMiddleware().concat(apiSlice.middleware),
    credentials: 'include',
});

export default store;

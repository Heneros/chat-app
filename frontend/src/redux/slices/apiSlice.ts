import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../../shared/utils/constants';

const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.user?.accessToken;
        headers.set('authorization', `Bearer ${token}`);
        return headers;
    },
});

export const apiSlice = createApi({
    baseQuery,
    tagTypes: ['Chat', 'User'],
    endpoints: (builder) => ({}),
});

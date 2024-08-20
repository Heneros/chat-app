import { apiSlice } from './apiSlice';

import { AUTH_URL } from '../../utils/constants';

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        logout: builder.query({
            query: () => ({
                url: `${AUTH_URL}/logout`,
            }),
        }),
        login: builder.mutation({
            query: (credentials) => ({
                url: `${AUTH_URL}/login`,
                method: 'POST',
                body: credentials,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
        }),
        registration: builder.mutation({
            query: (data) => ({
                url: `${AUTH_URL}/registration`,
                body: data,
                method: 'POST',
                credentials: true,
            }),
            providesTags: ['User'],
        }),
    }),
});

export const { useLoginMutation, useLogoutQuery, useRegistrationMutation } =
    userApiSlice;

import { apiSlice } from './apiSlice';

import { AUTH_URL } from '../../utils/constants';

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        logout: builder.query({
            query: () => ({
                url: `${AUTH_URL}/logout`,
                // providesTags: ['User']
            }),
        }),
        login: builder.mutation({
            query: (data) => ({
                url: `${AUTH_URL}/login`,
                body: data,
                method: 'POST',
                credentials: true,
                providesTags: ['User'],
            }),
        }),
        registration: builder.mutation({
            query: (data) => ({
                url: `${AUTH_URL}/registration`,
                body: data,
                method: 'POST',
                credentials: true,
                providesTags: ['User'],
            }),
        }),
    }),
});

export const { useLoginMutation, useLogoutQuery, useRegistrationMutation } =
    userApiSlice;

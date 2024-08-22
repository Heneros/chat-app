import { apiSlice } from './apiSlice';

import { AUTH_URL } from '../../utils/constants';
import { logout } from './auth';

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        logout: builder.mutation({
            query: () => ({
                url: `${AUTH_URL}/logout`,
                method: 'GET',
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    dispatch(logout());
                    dispatch(apiSlice.util.resetApiState());
                } catch (err) {
                    console.log(err);
                }
            },
        }),
        login: builder.mutation({
            query: (credentials) => ({
                url: `${AUTH_URL}/login`,
                method: 'POST',
                body: credentials,
                credentials: 'include',
                // headers: {
                //     'Content-Type': 'application/json',
                // },
            }),
        }),
        registration: builder.mutation({
            query: (data) => ({
                url: `${AUTH_URL}/registration`,
                body: data,
                method: 'POST',
                credentials: 'include',
            }),
            providesTags: ['User'],
        }),
    }),
});

export const { useLoginMutation, useLogoutMutation, useRegistrationMutation } =
    userApiSlice;

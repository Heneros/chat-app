import { AUTH_URL } from '@/shared/utils/constants';
import { logout } from '../auth/auth';
import { apiSlice } from '../api/apiSlice';

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        logout: builder.mutation({
            query: () => ({
                url: `${AUTH_URL}/logout`,
                // method: 'GET',
            }),
            async onQueryStarted(arg, { dispatch }) {
                try {
                    dispatch(logout());
                    dispatch(apiSlice.util.resetApiState());
                } catch (err) {
                    console.log(err);
                }
            },
            invalidatesTags: [{ type: 'User' }],
        }),
        login: builder.mutation({
            query: (credentials) => ({
                url: `/users/login`,
                method: 'POST',
                body: credentials,
                // credentials: 'include',
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
            invalidatesTags: [{ type: 'User' }],
        }),
    }),
});

export const { useLoginMutation, useLogoutMutation, useRegistrationMutation } =
    userApiSlice;

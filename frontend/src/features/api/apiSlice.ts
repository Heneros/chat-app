import {
    BaseQueryFn,
    createApi,
    FetchArgs,
    fetchBaseQuery,
    FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';

import { RootState } from '@/shared/lib/reducer';
import { BASE_URL } from '@/shared/utils/constants';

const baseQuery = fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/v1`,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const state = getState() as RootState;
        const token = state.auth.user?.accessToken;
        const googleToken = state.auth?.googleToken;
        const githubToken = state.auth?.githubToken;

        // console.log('googleToken', googleToken);
        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        } else if (googleToken) {
            headers.set('authorization', `Bearer ${googleToken}`);
        } else if (githubToken) {
            headers.set('authorization', `Bearer ${githubToken}`);
        }
        return headers;
    },
});

const baseQueryWithRefreshToken: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    let response = await baseQuery(args, api, extraOptions);
    return response;
};

export const apiSlice = createApi({
    baseQuery: baseQueryWithRefreshToken,
    tagTypes: ['Chat', 'User', 'Image'],
    endpoints: (builder) => ({}),
});

import { CHAT_URL } from '@/shared/utils/constants';
import { apiSlice } from '../api/apiSlice';

export const chatApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createChat: builder.mutation({
            query: ({ firstName, lastName }) => ({
                url: `${CHAT_URL}`,
                method: 'POST',
                // credentials: 'include',
                body: { firstName, lastName },
            }),
            invalidatesTags: ['Chat'],
        }),
        getAllChat: builder.query({
            query: () => ({
                url: `${CHAT_URL}`,
                method: 'GET',
            }),
            providesTags: ['Chat'],
        }),
        updateChat: builder.mutation({
            query: ({ chatId, firstName, lastName }) => ({
                url: `${CHAT_URL}/${chatId}`,
                method: 'PUT',
                body: { firstName, lastName },
                credentials: 'include',
            }),
            invalidatesTags: ['Chat'],
        }),
        getByIdChat: builder.query({
            query: ({ chatId }) => ({
                url: `${CHAT_URL}/${chatId}`,
                method: 'GET',
            }),
            providesTags: ['Chat'],
        }),
        deleteChat: builder.mutation({
            query: (chatId) => ({
                url: `${CHAT_URL}/${chatId}`,
                method: 'DELETE',
                credentials: 'include',
            }),
            invalidatesTags: ['Chat'],
        }),
        sendMessageToChat: builder.mutation({
            query: ({ chatId, message, imageUrl }) => ({
                url: `${CHAT_URL}/${chatId}/message`,
                method: 'POST',
                body: { message, imageUrl },
                credentials: 'include',
            }),
            invalidatesTags: ['Chat'],
        }),
        searchChat: builder.query({
            query: (keyword) => ({
                url: `${CHAT_URL}/search`,
                params: { keyword },
            }),
            providesTags: ['Chat'],
        }),
    }),
});

export const {
    useCreateChatMutation,
    useDeleteChatMutation,
    useGetAllChatQuery,
    useGetByIdChatQuery,
    useSendMessageToChatMutation,
    useSearchChatQuery,
    useUpdateChatMutation,
} = chatApiSlice;

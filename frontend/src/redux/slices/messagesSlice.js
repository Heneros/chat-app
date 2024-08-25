import { apiSlice } from './apiSlice';

import { CHAT_URL } from '../../utils/constants';

export const chatApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createChat: builder.mutation({
            query: (data) => ({
                url: `${CHAT_URL}`,
                method: 'POST',
                credentials: true,
            }),
            providesTags: ['Chat'],
        }),
        getAllChat: builder.query({
            query: () => ({
                url: `${CHAT_URL}`,
                method: 'GET',
            }),
            providesTags: ['Chat'],
        }),
        updateChat: builder.mutation({
            query: ({ chatId }) => ({
                url: `${CHAT_URL}/${chatId}`,
                method: 'PUT',
                credentials: true,
            }),
            providesTags: ['Chat'],
        }),
        getByIdChat: builder.query({
            query: ({ chatId }) => ({
                url: `${CHAT_URL}/${chatId}`,
                method: 'GET',
            }),
            providesTags: ['Chat'],
        }),
        deleteChat: builder.mutation({
            query: ({ postId }) => ({
                url: `${CHAT_URL}/${postId}`,
                method: 'DELETE',
                credentials: true,
            }),
            providesTags: ['Chat'],
        }),
        sendMessageToChat: builder.mutation({
            query: ({ chatId, message }) => ({
                url: `${CHAT_URL}/${chatId}/message`,
                method: 'POST',
                body: { message },
                credentials: true,
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
} = chatApiSlice;

import { UPLOAD_URL } from '@/shared/utils/constants';
import { apiSlice } from '../api/apiSlice';

export const fileApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        sendImage: builder.mutation({
            // query: ({ imageUrl }) => ({
            //     url: `${UPLOAD_URL}`,
            //     method: 'PATCH',
            //     credentials: 'include',
            //     body: { imageUrl },
            // }),
            query: ({ imageFile }) => {
                const formData = new FormData();
                formData.append('imageUrl', imageFile);

                return {
                    url: `${UPLOAD_URL}`,
                    method: 'PATCH',
                    credentials: 'include',
                    body: formData,
                };
            },
        }),
    }),
});

export const { useSendImageMutation } = fileApiSlice;

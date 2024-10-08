// export const getErrorMessage = (error: any): any => {
//     if (`status` in error) {
//         return `Error: ${error.status}`;
//     }
//     if (`message` in error) {
//         return error.message;
//     }
//     return 'An unknown error occurred';
// };

import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

export const getErrorMessage = (
    error: FetchBaseQueryError | SerializedError,
) => {
    if ('data' in error) {
        return (
            (error.data as { message?: string })?.message || 'An error occurred'
        );
    }
    if (`message` in error) {
        return error.message;
    }
    return 'An unknown error occurred';
};

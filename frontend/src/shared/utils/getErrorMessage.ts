export const getErrorMessage = (error: any): any => {
    if (`status` in error) {
        return `Error: ${error.status}`;
    }
    if (`message` in error) {
        return error.message;
    }
    return 'An unknown error occurred';
};

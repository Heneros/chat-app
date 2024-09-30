export interface User {
    id?: number;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    googleID?: string;
    refreshToken?: string[];
    accessToken?: string[];
}

export interface User {
    id?: number;
    email: string;
    username: string;
    firstname: string;
    lastname: string;
    googleID?: string;
    refreshToken?: string[];
    accessToken?: string[];
}

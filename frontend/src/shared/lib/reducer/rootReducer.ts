export interface RootState {
    auth: {
        user?: {
            accessToken: string;
        };
        googleToken: string;
        githubToken: string;
    };
}

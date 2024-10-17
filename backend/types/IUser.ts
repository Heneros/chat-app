import { Document } from 'mongoose';

export interface IUser extends Document {
    _id: string;
    password: string;
    passwordConfirm?: string;
    email: string;
    firstName: string;
    username: string;
    lastName: string;
    refreshToken: string[];
    automatedMessagesEnabled: boolean;
    provider: string;
    githubId?: string;
    googleId?: string;
    avatar?: string;
    matchPassword(enteredPassword: string): Promise<boolean>;
}

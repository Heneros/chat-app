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
    googleId: string;
    matchPassword(enteredPassword: string): Promise<boolean>;
}

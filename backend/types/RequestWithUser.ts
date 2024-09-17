import { Request } from 'express';
import { IUser } from './IUser';

export interface RequestWithUser extends Request {
    user?: IUser;
}

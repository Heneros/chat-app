import { Request } from 'express';
import { IUser } from '../models/UserModel';

export interface RequestWithUser extends Request {
    user?: IUser;
}

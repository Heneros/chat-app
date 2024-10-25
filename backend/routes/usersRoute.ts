import express, { Request, Response } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import authUser from '../controllers/users/authController';
import registerUser from '../controllers/users/registerController';
import logout from '../controllers/users/logoutController';
import updateProfileUser from '../controllers/users/updateProfileController';
import User from '../models/UserModel';
import { RequestWithUser } from '../types/RequestWithUser';

const router = express.Router();

router.route('/login').post(authUser);
router.route('/registration').post(registerUser);
router.route('/:id').patch(updateProfileUser);
router.route('/logout').get(logout);

router.get(
    '/github',
    passport.authenticate('github', { scope: ['user:email'] }),
);

router.get(
    '/github/callback',
    passport.authenticate('github', {
        failureRedirect: 'http://localhost:3000',
    }),
    async (req, res) => {
        const userReq = req as RequestWithUser;

        if (!userReq.user) {
            return res.redirect(
                'http://localhost:3000/login?error=auth_failed',
            );
        }

        const existingUser = await User.findById(userReq.user.id);

        if (!existingUser) {
            return res.redirect(
                'http://localhost:3000/login?error=user_not_found',
            );
        }

        const payload = {
            id: userReq.user.id,
            firstName: existingUser.firstName,
            lastName: existingUser.lastName || 'Name',
            username: existingUser.username,
            provider: existingUser.provider,
            avatar: existingUser.avatar,
        };

        const token = jwt.sign(payload, process.env.JWT_ACCESS_SECRET_KEY!, {
            expiresIn: '7d',
        });

        res.redirect(`http://localhost:3000/auth/success?token=${token}`);
        // res.redirect(`http://localhost:3000/auth/success?token=${token}`);
    },
);

router.route('/google').get(
    passport.authenticate('google', {
        session: false,
        scope: ['profile', 'email', 'openid'],
        accessType: 'offline',
        prompt: 'consent',
    }),
);
router.route('/google/redirect').get(
    passport.authenticate('google', {
        failureRedirect: 'http://localhost:3000',
    }),
    async (req: Request, res: Response) => {
        const userReq = req as RequestWithUser;

        if (!userReq.user) {
            return res.redirect(
                'http://localhost:3000/login?error=auth_failed',
            );
        }

        const existingUser = await User.findById(userReq.user.id);

        if (!existingUser) {
            return res.redirect(
                'http://localhost:3000/login?error=user_not_found',
            );
        }

        const payload = {
            id: userReq.user.id,
            firstName: existingUser.firstName,
            lastName: existingUser.lastName || 'Name',
            username: existingUser.username,
            provider: existingUser.provider,
            avatar: existingUser.avatar,
        };

        const token = jwt.sign(payload, process.env.JWT_ACCESS_SECRET_KEY!, {
            expiresIn: '7d',
        });

        res.redirect(`http://localhost:3000/auth/success?token=${token}`);
    },
);

export default router;

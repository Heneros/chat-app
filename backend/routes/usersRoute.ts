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
    passport.authenticate('github', { failureRedirect: '/login' }),
    (req, res) => {
        res.redirect('/');
    },
);

router.get(
    '/google',
    passport.authenticate('google', {
        session: false,
        scope: ['profile', 'email'],
        accessType: 'offline',
        prompt: 'consent',
    }),
);

router.get(
    '/google/redirect',
    passport.authenticate('google', {
        failureRedirect: '/login',
        session: false,
    }),
    async (req: Request, res: Response) => {
        const userReq = req as RequestWithUser;
        if (!userReq.user) {
            return res.status(401).json({ message: 'User is undefiend' });
        }

        const existingUser = await User.findById(userReq.user.id);
        const payload = {
            id: userReq.user.id,
            firstName: existingUser?.firstName,
            lastName: existingUser?.lastName || 'Name',
            username: existingUser?.username,
            provider: existingUser?.provider,
            avatar: existingUser?.avatar,
        };

        jwt.sign(
            payload,
            process.env.JWT_ACCESS_SECRET_KEY!,
            { expiresIn: '50m' },
            (err, token) => {
                const jwt = `${token}`;
                const embedJWT = `
    <html>
    <script>
    window.localStorage.setItem("googleToken",'${jwt}')
    window.location.href='/'
    </script>

    </html>
    
    `;
                res.send(embedJWT);
            },
        );
    },
);

export default router;

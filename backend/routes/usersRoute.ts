import express, { Request, Response } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import authUser from '../controllers/users/authController';
import registerUser from '../controllers/users/registerController';
import logout from '../controllers/users/logoutController';
import updateProfileUser from '../controllers/users/updateProfileController';
import User from '../models/UserModel';
import { RequestWithUser } from '../types/RequestWithUser';
import { systemLogs } from '../utils/Logger';

const router = express.Router();
const domain = process.env.DOMAIN;

router.route('/login').post(authUser);
router.route('/registration').post(registerUser);
router.route('/:id').patch(updateProfileUser);
router.route('/logout').get(logout);

router.get(
    '/github',
    passport.authenticate('github', {
        scope: ['user:email'],
    }),
);

router.route('/github/callback').get(
    passport.authenticate('github', {
        failureRedirect: 'http://localhost:3000/login?error=auth_failed',
    }),
    async (req, res) => {
        try {
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

            // const token = jwt.sign(
            //     payload,
            //     process.env.JWT_ACCESS_SECRET_KEY!,
            //     {
            //         expiresIn: '7d',
            //     },
            // );

            // res.redirect(
            //     `http://localhost:3000/auth/success?tokenGithub=${token}`,
            // );
            jwt.sign(
                payload,
                process.env.JWT_ACCESS_SECRET_KEY!,
                {
                    expiresIn: '7d',
                },
                (err, token) => {
                    if (err) {
                        console.log(err);

                        return res.status(500).send('Error generating token');
                    }

                    const jwt = `${token}`;
                    const emebedJWT = `
                <html>
                <script>
                      window.localStorage.setItem("googleToken", '${jwt}');
                      window.location.href= "${domain}";
                 </script>
                </html>
                `;
                    res.send(emebedJWT);
                },
            );
        } catch (error) {
            console.error('GitHub callback error:', error);
            //  res.redirect('http://localhost:3000/login?error=server_error');
        }
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
        try {
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

            jwt.sign(
                payload,
                process.env.JWT_ACCESS_SECRET_KEY!,
                {
                    expiresIn: '7d',
                },
                (err, token) => {
                    if (err) {
                        console.log(err);

                        return res.status(500).send('Error generating token');
                    }

                    const jwt = `${token}`;
                    const emebedJWT = `
                <html>
                <script>
                      window.localStorage.setItem("googleToken", '${jwt}');
                      window.location.href= "${domain}";
                 </script>
                </html>
                `;
                    res.send(emebedJWT);
                },
            );
        } catch (error) {
            systemLogs.error(`error `, error);
        }

        // res.redirect(`http://localhost:3000/auth/success?tokenGoogle=${token}`);
    },
);

export default router;

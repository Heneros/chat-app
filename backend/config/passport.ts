import 'dotenv/config';
import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';

import User from '../models/UserModel';

const domainURL = process.env.DOMAIN;

const googleCallbackURL = process.env.GOOGLE_CALLBACK_URL;

passport.serializeUser((user: any, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            callbackURL: `${domainURL}/api/v1/${googleCallbackURL}`,
        },
        (
            accessToken: string,
            refreshToken: string,
            profile: Profile,
            done: (error: any, user?: any) => void,
        ) => {
            User.findOne({ googleId: profile.id }).then((user) => {
                if (!user) {
                    const fullName = profile.displayName.trim().split(' ');
                    const firstName = fullName.shift();
                    const lastName =
                        fullName.length > 0 ? fullName.join(' ') : 'Noname ';

                    User.create({
                        username: profile._json.given_name,
                        firstName,
                        lastName,
                        avatar: profile._json.picture,
                        email: profile._json.email,
                        googleId: profile.id,
                        provider: 'google',
                    })
                        .then((user) => {
                            done(null, user);
                        })
                        .catch((err) => done(err, false));
                } else {
                    done(null, user);
                }
            });
        },
    ),
);

passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID || '',
            clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
            callbackURL: process.env.GITHUB_CALLBACK_URL || '',
        },
        async (
            accessToken: string,
            refreshToken: string,
            profile: Profile,
            done: (error: any, user?: any) => void,
        ) => {
            try {
                const existingUser = await User.findOne({
                    githubId: profile.id,
                });
                if (existingUser) {
                    return done(null, existingUser);
                }
                const newUser = new User({
                    githubId: profile.id,
                    username: profile.username,
                    email: profile.emails?.[0].value,
                    avatar: profile.photos?.[0].value,
                });
                await newUser.save();
                done(null, newUser);
            } catch (err) {
                done(err, null);
            }
        },
    ),
);

export default passport;

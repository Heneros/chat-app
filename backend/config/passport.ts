import 'dotenv/config';
import passport from 'passport';
import fs from 'fs';
import path from 'path';

import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';

import User from '../models/UserModel';
import { ChatData } from '../types/ChatData';
import Chat from '../models/ChatModel';

const domainURL = process.env.DOMAIN;
const googleCallbackURL = process.env.GOOGLE_CALLBACK_URL;

const predefineChats = JSON.parse(
    fs.readFileSync(path.resolve('backend/data/defaultChats.json')).toString(),
);

const googleAuth = () => {
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
            async (
                accessToken: string,
                refreshToken: string,
                profile: Profile,
                done: (error: any, user?: any) => void,
            ) => {
                try {
                    let existingUser = await User.findOne({
                        googleId: profile.id,
                    });

                    if (!existingUser) {
                        const fullName = profile.displayName.trim().split(' ');
                        const firstName = fullName.shift();
                        const lastName =
                            fullName.length > 0
                                ? fullName.join(' ')
                                : 'Noname ';
                        const newUser = await User.create({
                            username: profile._json.given_name,
                            firstName,
                            lastName,
                            avatar: profile._json.picture,
                            email: profile._json.email,
                            googleId: profile.id,
                            provider: 'google',
                        });

                        await Promise.all(
                            predefineChats.map(async (chatData: ChatData) => {
                                const updatedMessages = chatData.messages.map(
                                    (message) => ({
                                        ...message,
                                        sender: 'api',
                                    }),
                                );

                                await Chat.create({
                                    ...chatData,
                                    user: newUser._id,
                                    messages: updatedMessages,
                                });
                            }),
                        );
                        done(null, newUser);
                    } else {
                        done(null, existingUser);
                    }
                } catch (err) {
                    done(err, false);
                }
            },
        ),
    );

    passport.use(
        new GitHubStrategy(
            {
                clientID: process.env.GITHUB_CLIENT_ID!,
                clientSecret: process.env.GITHUB_CLIENT_SECRET!,
                callbackURL: process.env.GITHUB_CALLBACK_URL!,
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
                    // console.log(profile);

                    const fullName = profile.displayName.trim().split(' ');
                    const firstName = fullName.shift();
                    const lastName =
                        fullName.length > 0 ? fullName.join(' ') : ' No Name';

                    const newUser = new User({
                        githubId: profile.id,
                        username: profile.username,
                        firstName,
                        lastName,
                        avatar: profile._json.picture,
                        email: profile._json.email
                            ? profile._json.email
                            : `${profile.username}email@${profile.id}temp.com`,
                        provider: 'github',
                    });
                    await newUser.save();

                    await Promise.all(
                        predefineChats.map(async (chatData: ChatData) => {
                            const updatedMessages = chatData.messages.map(
                                (message) => ({
                                    ...message,
                                    sender: 'api',
                                }),
                            );

                            await Chat.create({
                                ...chatData,
                                user: newUser._id,
                                messages: updatedMessages,
                            });
                        }),
                    );
                    done(null, newUser);
                } catch (err) {
                    done(err, null);
                }
            },
        ),
    );
};
export default googleAuth;

import asyncHandler from 'express-async-handler';
import User from '../../models/UserModel.js';

const registerUser = asyncHandler(async (req, res) => {
    const { email, username, firstName, lastName, password, passwordConfirm } =
        req.body;

    if (!email) {
        res.status(400).json({ message: 'An email address is required' });
        throw new Error('An email address is required');
    }

    if (!username) {
        res.status(400).json({ message: 'A username is required' });
        throw new Error('A username is required');
    }

    if (!password) {
        res.status(400).json({ message: 'You must enter a password' });
        throw new Error('You must enter a password');
    }
    if (!passwordConfirm) {
        res.status(400).json({ message: 'Confirm password field is required' });
        throw new Error('Confirm password field is required');
    }

    if (!lastName && !firstName) {
        res.status(400).json({
            message: 'Empty field',
        });
        throw new Error('Empty field');
    }

    const userExistsByEmail = await User.findOne({ email });
    if (userExistsByEmail) {
        res.status(400).json({ message: 'Email is already registered' });
        return;
    }

    const userExistsByUsername = await User.findOne({ username });
    if (userExistsByUsername) {
        res.status(400).json({ message: 'Username is already taken' });
        return;
    }

    const newUser = new User({
        email,
        username,
        firstName,
        lastName,
        password,
        passwordConfirm,
    });

    const registeredUser = await newUser.save();

    res.json({
        success: true,
        message: `A new user ${registeredUser.username} has been registered!`,
    });
});

export default registerUser;

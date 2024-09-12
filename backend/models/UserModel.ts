import bcrypt from 'bcryptjs';
import mongoose, { Schema, Document } from 'mongoose';

import validator from 'validator';

// const { Schema } = mongoose;

interface IUser extends Document {
    password: string;
    passwordConfirm?: string;
    email: string;
    firstName: string;
    username: string;
    lastName: string;
    refreshToken: string[];
    googleId: string;
}
const userSchema = new Schema<IUser>(
    {
        email: {
            type: String,
            lowercase: true,
            unique: true,
            required: true,
            validate: [validator.isEmail, 'Please provide a valid email'],
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        passwordConfirm: {
            type: String,
            validate: {
                validator(value: string) {
                    return value === this.password;
                },
                message: 'Password do not match',
            },
        },
        refreshToken: [String],
        googleId: String,
    },
    { timestamps: true },
);

userSchema.methods.matchPassword = async function (enteredPassword: string) {
    return bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    if (this.password) {
        this.password = await bcrypt.hash(this.password, salt);
    }

    this.passwordConfirm = undefined;
    next();
});

const User = mongoose.model('User', userSchema);

export default User;

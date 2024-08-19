import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import validator from 'validator';

const { Schema } = mongoose;

const userSchema = new Schema(
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
            trim: true,
        },
        password: {
            type: String,
            required: true,
            googleID: String,
        },
        passwordConfirm: {
            type: String,
            validate: {
                validator(value) {
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

userSchema.methods.matchPassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    this.passwordConfirm = undefined;
    next();
});

const User = mongoose.model('User', userSchema);

export default User;

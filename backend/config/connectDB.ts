import mongoose from 'mongoose';

// let connectDB;

const connectDB = (url:string) => {
    mongoose
        .connect(url, {})
        .then(() => console.log('Connected to db...'))
        .catch((err) => console.error(`Error ${err}`));
};

export default connectDB;

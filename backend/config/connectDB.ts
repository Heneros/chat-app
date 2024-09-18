import mongoose from 'mongoose';

const connectDB = async (url: string) => {
    try {
        await mongoose.connect(url, {});
        // console.log('Connected to db...');
        return true;
        //  .catch((err) => console.error(`Error ${err}`));
    } catch (error) {
        console.log(`${error}`);
    }
};

export default connectDB;

import mongoose from 'mongoose';

const { Schema } = mongoose;

const chatSchema = new Schema(
    {
        // messageId: {
        //     type: String,
        //     required: true,
        //     unique: true,
        // },
        // roomId: {
        //     type: String,
        //     required: true,
        // },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        messages: [
            {
                type: String,
            },
        ],
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true },
);
const Chat = mongoose.model('Chat', chatSchema);

export default Chat;

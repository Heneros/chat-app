import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema(
    {
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
        chatId: String,
        createdAt: {
            type: Date,
            default: Date.now,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
    },
    { timestamps: true },
);
const Chat = mongoose.model('Chat', chatSchema);

export default Chat;

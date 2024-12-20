import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
    {
        text: {
            type: String,
            //      required: true,
        },
        imageUrl: {
            type: String,
        },
        sender: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
            ref: 'User',
        },
    },
    { timestamps: true },
);

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
        messages: [messageSchema],
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

import mongoose from 'mongoose';

const { Schema } = mongoose;

const messageSchema = new mongoose.Schema({
    text: String,
    sender: String,
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

// const chatSchema = new Schema(
//     {
//         firstName: {
//             type: String,
//             required: true,
//         },
//         lastName: {
//             type: String,
//             required: true,
//         },
//         messages: [
//             {
//                 type: String,
//             },
//         ],
//         chatId: String,
//         createdAt: {
//             type: Date,
//             default: Date.now,
//         },
//         user: {
//             type: mongoose.Schema.Types.ObjectId,
//             required: true,
//             ref: 'User',
//         },
//     },
//     { timestamps: true },
// );
const chatSchema = new mongoose.Schema({
    name: String,
    messages: [messageSchema],
});

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;

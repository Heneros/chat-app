import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    text: String,
    sender: String,
    timestamp: {
        type: Date,
        default: Date.now,
    },
});
const chatSchema = new mongoose.Schema({
    name: String,
    messages: [messageSchema],
});

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;

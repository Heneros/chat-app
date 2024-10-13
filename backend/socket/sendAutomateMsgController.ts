import { Request, Response } from 'express';
import axios from 'axios';
import https from 'https';
import { Server } from 'socket.io';
import User from '../models/UserModel';
import { io } from './socket';
import Chat from '../models/ChatModel';

// const sendMsgAutomate = async (req: Request, res: Response, io: Server) => {
//     const { id } = req.params;

//     if (!id) {
//         res.status(404).json({ message: 'User not found' });
//     }
//     const findUser = await User.findById(id).lean();

//     if (!findUser) {
//         return res.status(404).json({ message: 'User not found' });
//     }
//     if (findUser.automatedMessagesEnabled) {
//         try {
//             setTimeout(() => {
//                 const agent = new https.Agent({
//                     rejectUnauthorized: false,
//                 });
//                 const response = await axios.get(
//                     'https://api.quotable.io/random',
//                     {
//                         httpsAgent: agent,
//                     },
//                 );
//                 const apiMessage = response.data.content;

//                 console.log(apiMessage);
//             }, 1500);
//         } catch (error) {
//             console.log()
//         }
//     }
//     res.status(200).json({ findUser });
// };

const sendAutomatedMessages = async () => {
    // try {
    //     const users = await User.find({ automatedMessagesEnabled: true });
    //     users.forEach(async (user) => {
    //         const userChats = await Chat.find({
    //             user: user._id,
    //             automatedMessagesEnabled: true,
    //         });
    //     });
    //     const userChats = await Chat.find({
    //         user: user._id,
    //         automatedMessagesEnabled: true,
    //     });
    //     if (userChats.length > 0) {
    //         const agent = new https.Agent({ rejectUnauthorized: false });
    //         const response = await axios.get('https://api.quotable.io/random', {
    //             httpsAgent: agent,
    //         });
    //         const apiMessage = response.data.content;
    //         for (const chat of userChats) {
    //             const newMessage = {
    //                 text: apiMessage,
    //                 sender: 'api',
    //             };
    //             chat.messages.push(newMessage);
    //             await chat.save();
    //             if (chat.chatId) {
    //                 io.to(chat.chatId).emit(
    //                     `receiveMessage:${chat.chatId}`,
    //                     newMessage,
    //                 );
    //             }
    //         }
    //     }
    // } catch (error) {
    //     console.error(
    //         'Ошибка при отправке автоматизированных сообщений:',
    //         error,
    //     );
    // }
};

export default sendAutomatedMessages;

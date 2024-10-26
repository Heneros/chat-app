import { Socket } from 'socket.io';
import User from '../models/UserModel';

interface ToggleAutomatedMessagesArgs {
    userId: string;
    enabled: boolean;
    socket: Socket;
}

export const authenticateUser = async (
    userId: string,
    socket: Socket,
): Promise<boolean | undefined> => {
    try {
        const user = await User.findById(userId);
        if (user) {
            //  console.log('User Authentication', userId);
            socket.data.userId = userId;
            socket.data.automatedMessagesEnabled =
                user.automatedMessagesEnabled;
            return user.automatedMessagesEnabled;
        }
    } catch (error) {
        console.error('Authentication error:', error);
    }
};

export const toggleAutomatedMessages = async ({
    userId,
    enabled,
    socket,
}: ToggleAutomatedMessagesArgs): Promise<void> => {
    try {
        await User.findByIdAndUpdate(userId, {
            automatedMessagesEnabled: enabled,
        });
        socket.data.automatedMessagesEnabled = enabled;
        console.log('toggleAutomatedMessages works');
    } catch (error) {
        console.error('Failed to update user preferences:', error);
    }
};

import { sendRandomMessage } from './sendRandomMessage';
import { activeRooms } from './socket';

export const sendAutomatedMessages = async (activeUsers: string[]) => {
    if (activeRooms.length > 0) {
        console.log('sendAutomatedMessages work');

        activeUsers.forEach(async (userId) => {
            const randomRoomId =
                activeRooms[Math.floor(Math.random() * activeRooms.length)];

            if (randomRoomId) {
                // console.log(
                //     `Sending automated message to room: ${randomRoomId} for user ${userId}`,
                // );
                await sendRandomMessage(randomRoomId);
            }
        });
    } else {
        console.log('No active rooms, automated messages skipped');
    }
};

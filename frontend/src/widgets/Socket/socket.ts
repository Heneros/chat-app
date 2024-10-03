import { io, Socket } from 'socket.io-client';
import { BASE_URL } from '@/shared/utils/constants';

interface SocketWithRoom extends Socket {
    previousRoom?: string;
}
const socket: SocketWithRoom = io(BASE_URL);

export default socket;

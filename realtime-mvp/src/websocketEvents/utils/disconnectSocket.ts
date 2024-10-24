import { SocketIO } from '../../types';

export const disconnectSocket = (socket: SocketIO) =>
  setTimeout(() => {
    socket?.emit('invalid-token');
    socket.disconnect();
  }, 300);

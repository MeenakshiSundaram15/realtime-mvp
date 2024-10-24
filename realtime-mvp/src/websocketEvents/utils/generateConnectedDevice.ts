import { ConnectedDeviceType } from '../../models/device';
import { SocketIO } from '../../types';

export const generateConnectedDevice = ({ socket, device }: { socket: SocketIO; device: ConnectedDeviceType }) => {
  const connectedDevice: ConnectedDeviceType = {
    ...device,
    socket_id: socket.id,
  };

  return connectedDevice;
};

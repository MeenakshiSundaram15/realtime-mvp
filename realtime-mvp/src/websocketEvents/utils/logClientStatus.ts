import { ConnectedSocketClient, SocketIO } from '../../types';

export const logClientStatus = ({
  socket,
  client,
  status,
}: {
  socket: SocketIO;
  client: ConnectedSocketClient;
  status: 'connected' | 'disconnected';
}) => {
  let logMessage = status === 'connected' ? 'New client connected' : 'Client disconnected';
  if (socket.id) logMessage += `\n socket-id: ${socket.id}`;
  if (client?.device?.device_profile_name) logMessage += `\n profile: ${client?.device?.device_profile_name}`;
  if (client?.device?.device_guuid) logMessage += ` \n device_guuid: ${client?.device?.device_guuid}`;
  if (client?.device?.connectedDevice?.device_guuid)
    logMessage += ` \n connected device guuid: ${client?.device?.connectedDevice.device_guuid}`;
  if (client?.device?.connectedDevice?.ledge_device_guuid)
    logMessage += ` \n connected ledge guuid: ${client?.device?.connectedDevice.ledge_device_guuid}`;
  if (client?.email) logMessage += ` \n email: ${client?.email}`;
  if (client?.username) logMessage += ` \n username: ${client?.username}`;
  if (client?.roles?.length) logMessage += ` \n roles: ${client?.roles?.join(',')} \n\n`;

  console.log(logMessage);
};

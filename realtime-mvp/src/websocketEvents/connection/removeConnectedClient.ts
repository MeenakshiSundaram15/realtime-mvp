import { SocketAppState } from '../../app';
import { ConnectedSocketClient, SocketIO } from '../../types';
import { syncConnectedDeviceStates } from '../device/syncConnectedDevices';
import { getAllConnectedDeviceForAllStores } from '../state/get';

export const removeConnectedClient = ({ socket, client }: { socket: SocketIO; client: ConnectedSocketClient }) => {
  const accessibleToDashboard = client.accessibleToDashboard;
  const allConnectedDevices = getAllConnectedDeviceForAllStores();
  const connectedClientStoreCode = allConnectedDevices.find(
    (device) => device.socket_id === client.socket_id,
  )?.store_code;

  // Remove from connected devices
  if (connectedClientStoreCode) {
    const deviceIdx = SocketAppState.storeStates[connectedClientStoreCode]?.connectedDevices?.findIndex(
      (device) => device.socket_id === client.socket_id,
    );

    if (deviceIdx > -1) {
      SocketAppState.storeStates[connectedClientStoreCode]?.connectedDevices?.splice(deviceIdx, 1);
    }
  }

  // Remove from admin list
  if (accessibleToDashboard) {
    const adminIdx = SocketAppState.connectedAdmins?.findIndex(
      (connectedAdmin) => connectedAdmin.socket_id === socket.id,
    );
    if (adminIdx > -1) {
      SocketAppState.connectedAdmins.splice(adminIdx, 1);
    }
  }

  // Remove from connected clients
  const socketIndex = SocketAppState.connectedClients?.findIndex(
    (connectedClient) => connectedClient.socket_id === socket.id,
  );
  if (socketIndex > -1) {
    SocketAppState.connectedClients.splice(socketIndex, 1);
  }

  syncConnectedDeviceStates(client?.device?.store_code);
};

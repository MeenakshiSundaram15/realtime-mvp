import { SocketAppState } from '../../app';
import { updateDeviceStatus } from '../../services/connector/updateDeviceStatus';
import { CommonEventProps } from '../types';
import { logClientStatus } from '../utils/logClientStatus';
import { removeConnectedClient } from './removeConnectedClient';

export const onDisconnect = async ({ socket, client }: CommonEventProps) => {
  removeConnectedClient({ socket, client });

  // Update status if user is not an admin and if there is no guiid

  // Check if there is still another connected device with the same guuid
  const guuid = client?.device?.device_guuid;
  const hasRemainingConnectedClient = SocketAppState.storeStates[client?.device?.store_code]?.connectedDevices?.find(
    ({ device_guuid }) => device_guuid === guuid,
  );

  // Update to fallback connected client to backend
  if (hasRemainingConnectedClient) {
    updateDeviceStatus({
      device_guuid: client?.device?.device_guuid,
      is_active: true,
      socket_id: hasRemainingConnectedClient.socket_id,
    }).catch((err) => {
      console.log('error update disconnect status', err);
    });

    // Update to backend that all device with guuid was disconnected
  } else {
    updateDeviceStatus({ device_guuid: client?.device?.device_guuid, is_active: false, socket_id: null }).catch(
      (err) => {
        console.log('error update disconnect status', err);
      },
    );
  }
  logClientStatus({ client, socket, status: 'disconnected' });
};

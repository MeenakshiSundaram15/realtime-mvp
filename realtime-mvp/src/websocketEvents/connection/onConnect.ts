import { SocketAppState, io } from '../../app';
import { DeviceModel } from '../../models/device';
import { updateDeviceStatus } from '../../services/connector/updateDeviceStatus';
import { getAllConnectedDeviceForAllStores } from '../state/get';
import { updateDeviceCollectionState } from '../state/update/updateDeviceCollectionState';
import { updateStoreConnectedDeviceState } from '../state/update/updateStoreConnectedDeviceState';
import { CommonEventProps } from '../types';
import { logClientStatus } from '../utils';
import { generateConnectedDevice } from '../utils/generateConnectedDevice';

export const onConnect = async ({ socket, client }: CommonEventProps) => {
  const { accessibleToDashboard, username, device } = client;

  let deviceProps = device || ({} as DeviceModel);
  const { device_guuid } = deviceProps;

  SocketAppState.connectedClients.push(client);

  const deviceExist = !!SocketAppState.deviceCollection.find((d) => d.device_guuid === device_guuid);

  let message = '';
  if (accessibleToDashboard) {
    message = `Admin connected: ${username}`;

    // Emit to admin devices on all current states
    io.to(socket.id).emit('sync-connected-devices', getAllConnectedDeviceForAllStores());

    // Emit to admin devices on store manager accounts
    io.to(socket.id).emit('sync-store-manager-accounts', SocketAppState.storeManagers);

    // Add admin to connected admin
    SocketAppState.connectedAdmins.push(client);
  } else if (!device_guuid) {
    message = 'Missing device_guuid!';
    console.log('Missing device_guuid');
  } else {
    message = deviceExist ? 'Old device connected' : 'New device connected: ';

    const connectedDevice = generateConnectedDevice({ socket, device });

    const { profile, store } = connectedDevice;
    const hasMissingProp = !profile || !store;

    // Update state and connected devices list
    if (!hasMissingProp) {
      updateDeviceCollectionState(connectedDevice);
      updateStoreConnectedDeviceState({ storeCode: connectedDevice.store_code, connectedDevice });

      message += JSON.stringify(connectedDevice);

      client.device = connectedDevice;

      // Emit store cart
      if (SocketAppState?.storeStates?.[client.device.store_code]?.cart?.storeCart) {
        socket?.emit('sync-store-cart', SocketAppState?.storeStates?.[client.device.store_code]?.cart?.storeCart);
      }

      await updateDeviceStatus({
        device_guuid: client?.device?.device_guuid,
        is_active: true,
        socket_id: socket?.id,
      });
    }
  }

  logClientStatus({ client, socket, status: 'connected' });
};

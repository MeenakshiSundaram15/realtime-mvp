import { SocketAppState } from '../../../app';
import { ConnectedDeviceType } from '../../../models/device';

export const updateDeviceCollectionState = (connectedDevice: ConnectedDeviceType) => {
  const deviceIndexes = SocketAppState.deviceCollection.reduce((acc, curr, idx) => {
    curr.device_guuid === connectedDevice.device_guuid && acc.push(idx);
    return acc;
  }, [] as number[]);

  if (deviceIndexes.length) {
    deviceIndexes.forEach((idx) => {
      SocketAppState.deviceCollection[idx] = {
        ...connectedDevice,
        socket_id: SocketAppState.deviceCollection[idx].socket_id,
      };
    });
  } else {
    SocketAppState.deviceCollection.push(connectedDevice);
  }
};

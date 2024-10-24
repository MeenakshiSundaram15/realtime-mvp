import { SocketAppState, defaultSocketAppState, io } from '../../app';
import { getAllConnectedDeviceForAllStores } from '../state/get';

export const purgeServerState = (hardReload?: boolean) => {
  const allDevices = getAllConnectedDeviceForAllStores();
  const newState = JSON.parse(JSON.stringify(defaultSocketAppState));

  Object.keys(SocketAppState).forEach((appStateKey) => {
    SocketAppState[appStateKey] = defaultSocketAppState[appStateKey];
  });

  // Notify all devices to reload
  allDevices.forEach((device) => {
    if (device.socket_id) {
      if (hardReload) {
        io.to(device.socket_id).emit('reload');
      } else {
        io.to(device.socket_id).emit('refetch', 'device-details');
      }
    }
  });
};

import { SocketAppState } from '../../../app';
import { ConnectedDeviceType } from '../../../models/device';

export const getAllConnectedDeviceForAllStores = () => {
  const allConnectedDevices: ConnectedDeviceType[] = [];
  const storeCodes = Object.keys(SocketAppState.storeStates);
  storeCodes.forEach((storeCode) => {
    SocketAppState.storeStates[storeCode]?.connectedDevices?.forEach((device) => {
      allConnectedDevices.push(device);
    });
  });

  return allConnectedDevices;
};

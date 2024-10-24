import { SocketAppState } from '../../../app';

export const getConnectedDeviceIndexesFromStore = (storeCode: string, guuid: string) => {
  const storeState = SocketAppState.storeStates[storeCode];

  return storeState?.connectedDevices?.reduce((acc, curr, idx) => {
    curr.device_guuid === guuid && acc.push(idx);
    return acc;
  }, [] as number[]);
};

import _ from 'lodash';
import { SocketAppState, defaultStoreState, io } from '../../../app';
import { ConnectedDeviceType } from '../../../models/device';
import { syncConnectedDeviceStates } from '../../device/syncConnectedDevices';
import { getConnectedDeviceIndexesFromStore } from '../get/getConnectedDeviceIndexesFromStore';
import { initializeStoreState } from '../../../utils/initializeStoreState';

export const updateStoreConnectedDeviceState = ({
  storeCode,
  connectedDevice,
}: {
  storeCode: string;
  connectedDevice: ConnectedDeviceType;
}) => {
  // If it doesn't exist, create record with default store state and retry recursively;
  if (!SocketAppState.storeStates?.[storeCode]) {
    console.log(`Add store state for new store for : ${storeCode}`);
    initializeStoreState(storeCode);
    return updateStoreConnectedDeviceState({ storeCode, connectedDevice });
  }

  const storeState = SocketAppState.storeStates[storeCode];

  const connectedDeviceIdx = storeState?.connectedDevices?.findIndex(
    (device) => device.socket_id === connectedDevice.socket_id,
  );

  // If there is no record of the socket id, add one
  if (connectedDeviceIdx === -1) {
    SocketAppState?.storeStates[storeCode]?.connectedDevices?.push(connectedDevice);
  }

  // Get list of indexes for all connected client with same guuid
  const connectedDeviceIndexes = getConnectedDeviceIndexesFromStore(storeCode, connectedDevice.device_guuid);

  // Update all the devices with the matching guuid
  connectedDeviceIndexes.forEach((idx) => {
    SocketAppState.storeStates[storeCode].connectedDevices[idx] = {
      ...connectedDevice,
      socket_id: SocketAppState.storeStates[storeCode].connectedDevices[idx]?.socket_id,
    };
  });

  // Notify all devices about the updated state
  connectedDeviceIndexes.forEach((idx) => {
    const connectedDeviceState = SocketAppState.storeStates[storeCode].connectedDevices[idx];
    if (connectedDeviceState.socket_id) {
      io.to(connectedDeviceState.socket_id).emit('sync-device-settings', connectedDevice);
    }
  });

  // Update to other devices within store about the updated states of connected devices
  syncConnectedDeviceStates(storeCode);
};

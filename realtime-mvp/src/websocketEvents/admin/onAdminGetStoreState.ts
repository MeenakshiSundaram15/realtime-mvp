import { SocketAppState, io } from '../../app';
import { initializeStoreState } from '../../utils/initializeStoreState';
import { CommonEventProps } from '../types';

export const onAdminGetStoreState = ({ storeCode, socket }: CommonEventProps & { storeCode: string }) => {
  if (!SocketAppState?.storeStates[storeCode]) {
    initializeStoreState(storeCode);
  }

  io.to(socket.id).emit('sync-store-state-to-admin', SocketAppState?.storeStates[storeCode]);
};

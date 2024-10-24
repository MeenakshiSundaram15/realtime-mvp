import { SocketAppState, io } from '../../app';
import { initializeStoreState } from '../../utils/initializeStoreState';
import { CommonEventProps } from '../types';

export const onAdminGetStoreScannedLogs = ({ storeCode, socket }: CommonEventProps & { storeCode: string }) => {
  if (!SocketAppState.scannedLogs) {
    SocketAppState.scannedLogs = {};
  }

  if (!SocketAppState?.scannedLogs[storeCode]) {
    SocketAppState.scannedLogs[storeCode] = [];
  }

  io.to(socket.id).emit('sync-store-scanned-logs', {
    [storeCode]: SocketAppState.scannedLogs[storeCode],
  });
};

import { SocketAppState } from '../../../app';
import { StoreState } from '../../../types';

export const getStoreStateByStoreCode = (storeCode: string) =>
  SocketAppState?.storeStates[storeCode] || ({} as StoreState);

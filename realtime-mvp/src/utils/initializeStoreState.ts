import _ from 'lodash';
import { SocketAppState, defaultStoreState } from '../app';

export const initializeStoreState = (storeCode: string) => {
  SocketAppState.storeStates[storeCode] = _.cloneDeep({ ...defaultStoreState });
};

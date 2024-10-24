import { Socket } from 'socket.io';
import { ConnectedDeviceType, DeviceModel, LedgePopupModel } from './models/device';
import { OrderItemModel, OrderModel } from './models/order';
import { QRCodeModel, StoreManagerModel, UserModel } from './models/user';
import { PrintJobModel, PrinterModel } from './models/print';
import { OrderCartModel } from './models/cart';

export type RefetchDataType = 'device-details' | 'orders' | 'menu' | 'store-preferences';
export type MessageType = 'info' | 'success' | 'errored' | 'warning';
export type MessageEventType = 'print' | 'sync' | 'access-token' | 'refetch';
export type DeviceActionType = 'mark-as-ready' | 'checkout' | 'add-to-cart' | 'login';

export type ServerToClientEvents = {
  'sync-store-cart': (cart: OrderCartModel[]) => void;
  'sync-store-cart-order': (cartOrder: OrderCartModel) => void;
  'sync-selected-menu': (menu: any) => void;
  'sync-connected-devices': (devices: ConnectedDeviceType[]) => void;
  'sync-device-settings': (deviceSettings: ConnectedDeviceType) => void;
  'sync-setup-device-with-code': (payload: { device: Partial<DeviceModel>; code: string; user: UserModel }) => void;
  'invalid-token': () => void;
  'generate-qr': ({ code, expiry }: { code: string; expiry: number }) => void;
  'sync-store-manager-accounts': (accounts: StoreManagerModel[]) => void;
  'sync-store-scanned-logs': (scannedLogs: { [store_code: string]: ScannedLog[] }) => void;
  'sync-print-jobs': (printJobs: PrintJobModel[]) => void;
  'send-print-job-to-printer': (payload: {
    printJob: PrintJobModel;
    printer: PrinterModel;
    senderGuuid: string;
  }) => void;
  message: (payload: { type: MessageType; eventType: MessageEventType; data: any }) => void;
  'sync-store-state-to-admin': (storeState: StoreState) => void;
  reload: () => void;
  reset: () => void;
  refetch: (dataType: RefetchDataType) => void;
  'send-action-to-device': (payload: { action: DeviceActionType; data: any }) => void;
};

export type ClientToServerEvents = {
  'update-connected-device': (payload: AuthPayloadModel) => void;
  'get-store-state': (storeCode: string) => void;
  'get-store-scanned-logs': (storeCode: string) => void;
  'create-store-cart': (cart: OrderCartModel) => void;
  'update-store-cart': (cart: OrderCartModel) => void;
  'remove-store-cart': (orderToken: string) => void;
  'select-store-cart': (orderToken: string) => void;
  'unselect-store-cart': () => void;
  'send-print-job': (printJobProps: {
    data: any;
    printerData: PrinterModel;
    storeCode: string;
    order?: OrderModel;
  }) => void;
  'update-print-status': (props: { storeCode?: string; printJobId: number; status: PrintJobModel['status'] }) => void;
  'remove-print-job': (props: { storeCode?: string; printJobId: number }) => void;
  'add-store-cart-item': (orderToken: string, orderItem: OrderItemModel) => void;
  'remove-store-cart-item': (orderToken: string, orderItemNumber: number) => void;
  'update-store-cart-item': (
    orderToken: string,
    orderItemNumber: number,
    orderItem: OrderItemModel,
    updateCartProps?: Partial<OrderCartModel>
  ) => void;
  'update-device-settings': (device: ConnectedDeviceType) => void;
  'setup-device-with-code': (payload: { device: ConnectedDeviceType; code: string; user: UserModel }) => void;
  'show-ledge-popups': (ledgePopups: LedgePopupModel[]) => void;
  'hide-ledge-popups': (deviceIds: string[]) => void;
  'update-selected-menu': (menu: any) => void;
  'refetch-server-data': () => void;
  'reload-device': (guuid: string) => void;
  'reset-device': (socketId: string) => void;
  'refetch-store-data': (props: { storeCode?: string; dataType: RefetchDataType }) => void;
  message: (payload: { type: MessageType; eventType: MessageEventType; data: any; receiverGuuid: string }) => void;
  refetch: (guuid: string, dataType: RefetchDataType) => void;
  'purge-state': (hardReload?: boolean) => void;
  'send-scanned-code': (message: string) => void;
};

export type ScannedLog = {
  code: string;
  timestamp: number;
};

export type SocketStateModel = {
  connectedAdmins: ConnectedSocketClient[];
  storeStates: {
    [store_code: string]: StoreState;
  };
  scannedLogs: {
    [store_code: string]: ScannedLog[];
  };
  storeManagers: StoreManagerModel[];
  deviceCollection: ConnectedDeviceType[];
  connectedClients: ConnectedSocketClient[];
  accessToken?: string;
  accessTokenUsername?: string;
  tokenExpiry?: number;
  refreshToken?: string;
  idToken?: string;
  temporaryIds: {
    code: string;
    expiry: number;
  }[];
};

export type StoreState = {
  connectedDevices: ConnectedDeviceType[];
  cart: {
    storeCart: OrderCartModel[];
  };
  printJobs: PrintJobModel[];
  printers: PrinterModel[];
};

export type InterServerEvents = {
  ping: () => void;
};

export type SocketData = {
  deviceId: string;
};

export type SocketIO = Socket<ClientToServerEvents, ServerToClientEvents>;

export type ConnectedSocketClient = {
  username: string;
  socket_id: string;
  email: string;
  connectedTime: number;
  accessibleToDashboard?: boolean;
  isStoreManager?: boolean;
  device?: ConnectedDeviceType;
  roles: string[];
};

export type AuthPayloadModel = {
  idJwtToken: string;
  refreshToken: string;
  accessJwtToken: string;
  device?: ConnectedDeviceType;
  qrCode?: QRCodeModel;
};

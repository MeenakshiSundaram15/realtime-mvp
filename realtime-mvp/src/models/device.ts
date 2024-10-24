import { OrderModifierItemModel, OrderPOS } from './order';
import { RegionModel } from './region';

export const DeviceTypeNames = [
  'ipad',
  'ledge',
  'menu',
  'tv',
  'tv-strip',
  // 'order-status',
] as const;

export const DeviceTypeNamesWithScreens = ['ledge', 'tv', 'tv-strip'];

export type DeviceTypeName = (typeof DeviceTypeNames)[number];

export const DeviceStatuses = ['active', 'locked', 'inactive'] as const;

export type DeviceStatus = (typeof DeviceStatuses)[number];

export const LedgeTypes = ['video', 'image'] as const;

export type LedgeType = (typeof LedgeTypes)[number];

export const ScreenSegmentTypes = ['video', 'image', 'dynamic'] as const;

export type ScreenSegmentType = (typeof ScreenSegmentTypes)[number];

export type LedgeSegmentItemModel = {
  type: LedgeType;
  url: string;
};

export type LedgeSegmentModel = {
  width: number;
  items: LedgeSegmentItemModel[];
};

export type DeviceProfileModel = {
  id: number;
  name: string;
  description: string;
  typeId: number;
};

export type ConsolidatedDeviceProfileModel = DeviceProfileModel & {
  type: DeviceType;
};

export type DeviceType = {
  id: number;
  name: DeviceTypeName;
  description: string;
};

export type StoreModel = {
  id: number;
  address: string;
  store_code: string;
  regionCode: string;
  description: string | null;
  email: string;
  contact_number: string;
  label: string;
  labelForPickup: string;
  identifier: string;
  menu_details: {
    establishment?: number;
    mode?: number;
    name?: string;
    pos?: OrderPOS;
  };
};

export type PartitionModel = {
  id?: number;
  width_percent: number | string;
  static_url_id: number;
  staticUrl: FileModel;
  screen_id?: number;
  order_seq: number;
};

// export type PlayListModel = {
//   id?: number;
//   width_percent: number | string;
//   static_url_id: number;
//   staticUrl: FileModel;
//   screen_id?: number;
//   order_seq: number;
// };

export type ScreenModel = {
  id: number;
  start_date?: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
  name: string;
  region_code: string;
  device_profile_name: string;
  partitions: PartitionModel[];
  // playList: PlayListModel[];
  interval_frequency?: number;
  interval_time?: string;
  is_playlist: boolean;
};

// What we get from API server
export type DeviceModel = {
  id: number;
  store_code: string;
  device_profile_name: string;
  region_code: string;
  device_guuid: string;
  is_active: boolean;
  socket_id: string;
  created_at: string;
  updated_at: string;
  screens: ScreenModel[];
  connectedDevice: connectedDeviceModel | null;
  printer: string | null;
};

export type profilesByStoreModel = {
  deviceDetails: DeviceModel[];
};

export type connectedDeviceModel = {
  device_guuid: string;
  ledge_device_guuid: string;
};

// What we retrieve and have to pass to websocket server
export type ConnectedDeviceType = DeviceModel & {
  store: StoreModel;
  profile: ConsolidatedDeviceProfileModel;
  ledgePopup?: LedgePopupModel | null;
  platform?: 'pc' | 'web';
  version?: string;
};

export const LedgePopupTypes = [
  'diets',
  'filtered-menu',
  'modifier-menu',
  'preferences',
  'nutrition',
  'add-ons',
  'soups',
  'receipt',
  'ingredients',
  'close',
  'demo',
] as const;

export type LedgePopupType = (typeof LedgePopupTypes)[number];

export type LedgePopupModel = {
  device_guuid: string;
  popupType: LedgePopupType;
  popupProps: any;
};

// export type LedgeSelectedMenuItemModel = {
//   label: string;
//   price: number;
//   image: string;
//   itemId: number;
//   modifierItems: OrderModifierItemModel[];
//   flowState?: any;
// };

export type SelectedMenuItemModel = {
  label: string;
  price: number;
  image_url: string;
  itemId: number;
  modifierItems: OrderModifierItemModel[];
  flowState?: any;
};

// export type SelectedLedgeModel = {
//   device_guuid: string;
//   selectedLedgeDevices: string[];
// };

export type SelectedLedgeModel = {
  device_guuid: string;
  selectedLedgeDevices: string[];
};

export type FileModel = {
  id: number;
  static_name: string;
  display_name: string;
  static_url: string;
  static_category: 'image' | 'video';
  static_type: string;
  created_at: string;
  updated_at: string;
  description: string | null;
  region_id: number;
  device_type: {
    id: number;
    name: string;
    description: string;
  };
  region: {
    id: number;
    name: string;
    region_code: string;
  };
};

export type S3ReponseModel = {
  eTag: string;
  key: string;
  lastModified: Date;
  size: number;
};

export type StaticStoreModel = {
  id: number;
  store_code: string;
  store_id: number;
  description: string | null;
  created_at: string;
  updated_at: string;
  region: RegionModel;
  static_details: FileModel;
};

export type TProfileName =
  | 'artist-1'
  | 'artist-2'
  | 'chopper-1'
  | 'chopper-2'
  | 'cashier-1'
  | 'tv-strip-1'
  | 'tv-1'
  | 'tv-2'
  | 'tv-3'
  | 'tv-4'
  | 'tv-5'
  | 'tv-6'
  | 'ledge-1'
  | 'ledge-2'
  | 'ledge-3'
  | 'ledge-4'
  | 'ledge-5'
  | 'headquarter-1';

export type TMetaDataName = 'ledge_meta_data' | 'menu_meta_data';

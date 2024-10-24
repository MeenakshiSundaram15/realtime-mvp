import { OrderModel, SelectedMenuItemModel } from './order';

export type OrderCartModel = Omit<OrderModel, 'id'> & {
  selectedDeviceGUUID?: string | null;
  selectedModifierGroupId?: number;
  selectedMenuItem?: SelectedMenuItemModel;
  selectedSubCategoryId?: number;
  selectedCategoryId?: number;
  customer_uuid?: string | null;
};

export type OptionalSurchargeModel = {
  surcharge_type: string;
  description: string;
  pretax_price: string;
  price: string;
  discount_amount: string;
  total_tax: string;
};

export type OrderStatusType = 'new' | 'confirmed' | 'printing' | 'canceled' | 'payment failed' | 'paid';

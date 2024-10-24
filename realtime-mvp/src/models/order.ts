import { OrderCartModel } from './cart';

export type OrderOptionalModel = Partial<OrderCartModel>;

export type OrderStatus =
  | 'CART'
  | 'PROCESSING'
  | 'CONFIRMED'
  | 'PAID'
  | 'COMPLETED'
  | 'PAYMENT_FAILED'
  | 'FAILED'
  | 'CANCELLED';

export type OrderType = 'TAKEAWAY' | 'DINE_IN';

export type OrderPOS = 'REVEL';

// export type OrderModifierItemModel = {
//   modifierGroupId: number;
//   id: number;
//   label: string;
//   qty: number;
//   unit_price: number;
//   original_unit_price: number;
//   sell_price: number;
//   image_url: string | null;
// };

// export type OrderItemModel = {
//   productId: number;
//   orderItemNumber: number;
//   label: string | undefined;
//   qty: number;
//   sell_price: number;
//   totalPrice: number;
//   remainingSwapLimit?: number;
//   image_url: string;
//   default_modifier_items: OrderModifierItemModel[];
//   modifierItems: OrderModifierItemModel[];
//   addOnAndRemovedModifiers: AddOnAndRemovedModifiersModel[];
//   removedModifiersLeft: AddOnAndRemovedModifiersModel[];
// };

export type DetailedOrderModifierItemModel = {
  id: number;
  sku: string;
  modifierGroupId: number;
  sort: number;
  label: string;
  default_modifier_qauntity: number;
  unit_price: number;
  original_unit_price: number;
  image_url: string;
  max_modifier_qty: number;
  quantity_in_stock: number | null;
  active: boolean;
};

export type OrderModifierItemModel = {
  modifier_id: number;
  modifier_cost: number;
  modifier_price: number;
  qty: number;
  qty_type: number;
  admin_mod_key: number | null;
};

export type OrderItemModel = {
  product_id: number;
  special_request?: string;
  quantity: number;
  calculated_product_price: number;
  base_product_price: number;
  product_name_override?: string;
  product_sub_id?: string;
  modifiers: OrderModifierItemModel[];
  remainingSwapLimit?: number;
  default_modifier_items: OrderModifierItemModel[];
  addOnAndRemovedModifiers: AddOnAndRemovedModifiersModel[];
  removedModifiersLeft: AddOnAndRemovedModifiersModel[];
};

export type AddOnAndRemovedModifiersModel = OrderModifierItemModel & {
  type: 'addon' | 'removed';
  discountPriceFractional: number;
};

export type OrderPaymentModel = {
  tip: number;
  type: number;
  id?: number;
};

export type OrderModel = {
  order_status: OrderStatus;
  order_type: OrderType;
  order_token: string;
  store_code: string;
  pos: OrderPOS;
  call_name: string;
  order_items: OrderItemModel[];
  payment_info: OrderPaymentModel;
  id: number;
  created_at?: string;
  updated_at?: string;
  pos_order_id?: string;
  total?: string;
};

export type SelectedMenuItemModel = OrderMenuItemModel & {
  orderItemNumber?: number;
};

export type OrderMenuItemModel = {
  order: OrderItemModel;
};

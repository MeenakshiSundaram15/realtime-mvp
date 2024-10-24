import { deepEqual } from 'assert';
import { SocketAppState, io } from './app';
import { OrderCartModel } from './models/cart';
import { OrderItemModel } from './models/order';
import { ConnectedSocketClient } from './types';
import { refetchStoreData } from './websocketEvents/deviceUtility/refetchStoreData';
import { getStoreStateByStoreCode } from './websocketEvents/state/get';
import { CommonEventProps } from './websocketEvents/types';

const timeoutDuration = 1000 * 60 * 15; // Timeout in 15 minutes
const timeoutInterval = 1000 * 15; // Interval checks every 15 seconds

const getStoreCartTimeoutId = (storeCode: string, orderToken: string) => `${storeCode}|${orderToken}`;

const storeCartTimeouts: {
  [key: string]: number;
} = {};

const checkCartTimeout = () => {
  const now = Date.now();
  const storeCodes = {};
  const timeoutKeys = Object.keys(storeCartTimeouts);

  timeoutKeys.forEach((key) => {
    if (storeCartTimeouts[key]) {
      if (now - storeCartTimeouts[key] > timeoutDuration) {
        // unselect store cart if it exist
        const splitted = key.split('|');
        const storeCode = splitted[0];
        const orderToken = splitted[1];
        const storeCart = getStoreCartByStoreCode(storeCode);
        const cartIdx = storeCart && storeCart.findIndex((cart) => cart.order_token === orderToken);
        // Delete from timeout list
        delete storeCartTimeouts[key];
        // Unselect or remove cart
        if (cartIdx > -1) {
          storeCodes[storeCode] = true;

          const isCart = SocketAppState.storeStates[storeCode].cart.storeCart[cartIdx].order_status === 'CART';

          const selected = SocketAppState.storeStates[storeCode].cart.storeCart?.[cartIdx]?.selectedDeviceGUUID;
          if (selected) {
            if (isCart) {
              SocketAppState.storeStates[storeCode].cart.storeCart[cartIdx].selectedDeviceGUUID = null;
              SocketAppState.storeStates[storeCode].cart.storeCart[cartIdx].selectedModifierGroupId = undefined;
              SocketAppState.storeStates[storeCode].cart.storeCart[cartIdx].selectedModifierGroupId = undefined;
            } else {
              SocketAppState.storeStates[storeCode].cart.storeCart?.splice(cartIdx, 1);
            }
          }
        }
      }
    }
  });

  if (Object.keys(storeCodes).length) {
    Object.keys(storeCodes).forEach((storeCode) => {
      syncAllStoreDevicesCart({ storeCode });
    });
  }
};

let cartTimeoutInterval;

const initializeCartTimeout = () => {
  if (!cartTimeoutInterval) cartTimeoutInterval = setInterval(checkCartTimeout, timeoutInterval);
};

const resetStoreCartTimer = (storeCode: string, orderToken: string) => {
  if (!cartTimeoutInterval) initializeCartTimeout();
  storeCartTimeouts[getStoreCartTimeoutId(storeCode, orderToken)] = Date.now();
};

const getStoreCartByStoreCode = (storeCode: string) => {
  return SocketAppState.storeStates?.[storeCode]?.cart?.storeCart || ({} as OrderCartModel[]);
};

export const unselectStoreCartItem = ({ storeCode, cartIdx }: { storeCode: string; cartIdx: number }) => {
  try {
    console.log(`unselect store cart. ${storeCode} - ${cartIdx}`);
    if (SocketAppState?.storeStates?.[storeCode]?.cart?.storeCart?.[cartIdx]) {
      SocketAppState.storeStates[storeCode].cart.storeCart[cartIdx].selectedModifierGroupId = undefined;
      SocketAppState.storeStates[storeCode].cart.storeCart[cartIdx].selectedMenuItem = undefined;
    }
  } catch (err) {
    console.log(`unselectStoreCartItem error ${JSON.stringify(err)}`);
  }
};

export const onCreateStoreCart = ({ cart, client, ...rest }: CommonEventProps & { cart: OrderCartModel }) => {
  try {
    console.log(
      `create store cart ${client?.device?.store_code} - ${client?.device?.device_profile_name} - ${cart?.order_token}`,
    );
    const device = client?.device;
    const storeCode = client?.device?.store?.store_code;
    const storeCart = getStoreCartByStoreCode(device?.store_code);
    OnUnselectStoreCart({ client, ...rest });
    const newOrderToken = cart.order_token;
    const isCartOrderExist = storeCart?.findIndex((order) => order.order_token === newOrderToken);
    if (storeCart && isCartOrderExist === -1) {
      SocketAppState.storeStates[storeCode].cart.storeCart?.push(cart);
      console.log(`CREATE ORDER (store: ${storeCode}) order #${cart?.order_token}`);
      // console.log(
      //   SocketAppState.storeStates[storeCode].cart.storeCart[
      //     SocketAppState.storeStates[storeCode].cart.storeCart.length - 1
      //   ],
      // );
    }
    syncAllStoreDevicesCart({ storeCode });

    // Reset timeout
    resetStoreCartTimer(storeCode, newOrderToken);
  } catch (err) {
    console.log(`onCreateStoreCart error ${JSON.stringify(err)}`);
  }
};

// No unselect is needed since we're removing an item from an array, we should use splice for this
export const onRemoveStoreCart = ({ orderToken, client }: CommonEventProps & { orderToken: string }) => {
  try {
    console.log(
      `remove store cart ${client?.device?.store_code} - ${client?.device?.device_profile_name} - ${orderToken}`,
    );
    const storeCode = client?.device?.store?.store_code;
    const storeCart = getStoreCartByStoreCode(storeCode);
    const idx = storeCart?.findIndex((cart) => cart.order_token === orderToken);
    if (idx > -1) {
      // We only need to remove the record, unselecting is not required since the state is stored in the cart itself
      SocketAppState.storeStates[storeCode].cart.storeCart?.splice(idx, 1);
      console.log('Cart removed in Store ', storeCode);
    }
    syncAllStoreDevicesCart({ storeCode });
  } catch (err) {
    console.log(`onRemoveStoreCart error ${JSON.stringify(err)}`);
  }
};

// Do we need to know device guuid if we're updating the store cart?
export const onUpdateStoreCart = ({ cart, client }: CommonEventProps & { cart: OrderCartModel }) => {
  try {
    console.log(
      `update store cart ${client?.device?.store_code} - ${client?.device?.device_profile_name} - ${cart?.order_token}`,
    );
    const storeCode = client?.device?.store_code;
    const storeCart = getStoreCartByStoreCode(storeCode);
    const orderToken = cart.order_token;
    const idx = storeCart?.findIndex((cart) => orderToken === cart.order_token);
    if (idx > -1) {
      SocketAppState.storeStates[storeCode].cart.storeCart[idx] = cart;
      console.log('Cart Updated in Store ', storeCode);
    }
    syncAllStoreDevicesCart({ storeCode, client });

    // Reset timeout
    resetStoreCartTimer(storeCode, orderToken);
  } catch (err) {
    console.log(`onUpdateStoreCart error ${JSON.stringify(err)}`);
  }
};

export const onSelectStoreCart = ({ orderToken, client, ...rest }: CommonEventProps & { orderToken: string }) => {
  try {
    console.log(
      `select store cart ${client?.device?.store_code} - ${client?.device?.device_profile_name} - ${orderToken}`,
    );

    const device = client?.device;
    const storeCode = client?.device?.store?.store_code;
    const storeCart = getStoreCartByStoreCode(storeCode);
    OnUnselectStoreCart({ client, ...rest });

    const idx = storeCart?.findIndex((cart) => cart.order_token === orderToken);
    const isOrderSelected = idx > -1 && storeCart?.[idx]?.selectedDeviceGUUID;

    if (isOrderSelected) {
      console.log('order already selected');
    } else if (idx > -1) {
      console.log('select cart order');
      SocketAppState.storeStates[storeCode].cart.storeCart[idx].selectedDeviceGUUID = device.device_guuid;
    }
    syncAllStoreDevicesCart({ storeCode });

    // Reset timeout
    resetStoreCartTimer(storeCode, orderToken);
  } catch (err) {
    console.log(`onSelectStoreCart error ${JSON.stringify(err)}`);
  }
};

// Unselecting cart by device guuid will be sufficient, unless we're planning to kick other artist out from selection
// Also, we don't need to create another cart object, we can modify the values directly with the store code and cart index
export const OnUnselectStoreCart = ({
  client,
  syncAfterCall = false,
}: CommonEventProps & { syncAfterCall?: boolean }) => {
  try {
    console.log(`unselect store cart ${client?.device?.store_code} - ${client?.device?.device_profile_name}`);
    const device = client?.device;
    const storeCode = client?.device?.store?.store_code;
    const storeCart = getStoreCartByStoreCode(storeCode);
    const idx = storeCart?.findIndex((cart) => cart?.selectedDeviceGUUID === device.device_guuid);
    const selected = idx > -1 && storeCart[idx].selectedDeviceGUUID;
    if (idx > -1) {
      const orderToken = SocketAppState.storeStates[storeCode].cart.storeCart[idx].order_token;
      SocketAppState.storeStates[storeCode].cart.storeCart[idx].selectedDeviceGUUID = null;
      unselectStoreCartItem({ storeCode, cartIdx: idx });
      if (storeCart[idx].order_status !== 'CART') {
        // Remove cart if status isn't CART
        console.log(`Remove cart for order status that isn't cart`);
        SocketAppState.storeStates[storeCode].cart.storeCart?.splice(idx, 1);
      }

      // Remove from timeout checker as well
      if (storeCartTimeouts?.[orderToken]) {
        delete storeCartTimeouts[orderToken];
      }
    }
    if (syncAfterCall) {
      syncAllStoreDevicesCart({ storeCode });
    }
  } catch (err) {
    console.log(`OnUnselectStoreCart error ${JSON.stringify(err)}`);
  }
};

export const onAddStoreCartItem = ({
  client,
  orderToken,
  orderItem,
}: CommonEventProps & { orderToken: string; orderItem: OrderItemModel }) => {
  try {
    console.log(
      `remove store cart item. ${client?.device?.store_code} - ${
        client?.device?.device_profile_name
      } - ${orderToken} - ${JSON.stringify(orderItem)}`,
    );
    const device = client?.device;
    const storeCode = client?.device?.store?.store_code;
    const storeCart = getStoreCartByStoreCode(storeCode);
    const cartIdx = storeCart?.findIndex((order) => order.order_token === orderToken);
    const cart = cartIdx > -1 && storeCart[cartIdx];
    const isSelectedBySender = cart?.selectedDeviceGUUID === device?.device_guuid;

    if (cart && !isSelectedBySender) {
      console.log(`cart is not selected by sender: ${device?.device_guuid}`);
    }

    if (isSelectedBySender) {
      SocketAppState.storeStates[storeCode].cart.storeCart[cartIdx].order_items.push(orderItem);
      SocketAppState.storeStates[storeCode].cart.storeCart[cartIdx].selectedSubCategoryId = undefined;
      unselectStoreCartItem({ storeCode, cartIdx });
    }

    syncAllStoreDevicesCart({ storeCode });
  } catch (err) {
    console.log(`onAddStoreCartItem error ${JSON.stringify(err)}`);
  }
};

export const onRemoveStoreCartItem = ({
  client,
  orderToken,
  orderItemNumber,
}: CommonEventProps & { orderToken: string; orderItemNumber: number }) => {
  try {
    console.log(
      `remove store cart item. ${client?.device?.store_code} - ${client?.device?.device_profile_name} - ${orderToken} - ${orderItemNumber}`,
    );
    const device = client?.device;
    const storeCode = client?.device?.store?.store_code;
    const storeCart = getStoreCartByStoreCode(device?.store_code);
    const cartIdx = storeCart?.findIndex((order) => order.order_token === orderToken);
    const cart = cartIdx > -1 && storeCart?.[cartIdx];
    const isCartSelectedBySender = cart?.selectedDeviceGUUID === device.device_guuid;

    if (cart && !isCartSelectedBySender) {
      console.log(`cart is not selected by sender: ${device.device_guuid}`);
    }

    if (isCartSelectedBySender) {
      SocketAppState.storeStates[storeCode].cart.storeCart[cartIdx].order_items.splice(orderItemNumber - 1, 1);

      unselectStoreCartItem({ storeCode, cartIdx });
    }
    syncAllStoreDevicesCart({ storeCode });
  } catch (err) {
    console.log(`onRemoveStoreCartItem error ${JSON.stringify(err)}`);
  }
};

export const onUpdateStoreCartItem = ({
  client,
  orderToken,
  orderItemNumber,
  orderItem,
  updateCartProps,
}: CommonEventProps & {
  orderToken: string;
  orderItemNumber: number;
  orderItem: OrderItemModel;
  updateCartProps?: Partial<OrderCartModel>;
}) => {
  try {
    console.log(
      `update store cart item. ${client?.device?.store_code} - ${client?.device?.device_profile_name} - ${orderToken} - ${orderItemNumber}`,
    );
    const device = client?.device;
    const storeCode = client?.device?.store?.store_code;
    const storeCart = getStoreCartByStoreCode(device?.store_code);
    const cartIdx = storeCart?.findIndex((order) => order.order_token === orderToken);
    const cart = storeCart[cartIdx];
    const orderItemIdx = orderItemNumber - 1;
    const targetOrderItem = cart.order_items[orderItemIdx];

    if (cart.selectedDeviceGUUID === device?.device_guuid) {
      SocketAppState.storeStates[storeCode].cart.storeCart[cartIdx].order_items[orderItemIdx] = orderItem;
      unselectStoreCartItem({ storeCode, cartIdx });
    }

    // Update props
    if (updateCartProps) {
      Object.keys(updateCartProps).forEach((key) => {
        if (SocketAppState?.storeStates?.[storeCode]?.cart?.storeCart?.[cartIdx]?.[key] !== undefined) {
          SocketAppState.storeStates[storeCode].cart.storeCart[cartIdx][key] = updateCartProps[key];
        }
      });
    }

    syncAllStoreDevicesCart({ storeCode, client });
  } catch (err) {
    console.log(`onUpdateStoreCartItem error ${JSON.stringify(err)}`);
  }
};

const syncAllStoreDevicesCart = ({ storeCode, client }: { storeCode: string; client?: ConnectedSocketClient }) => {
  try {
    const storeState = getStoreStateByStoreCode(storeCode);
    console.log(`sync store cart: ${storeCode}`);
    if (storeState?.connectedDevices) {
      storeState?.connectedDevices.forEach((device) => {
        // console.log('device to sync:', device.store_code, device.device_profile_name);
        if (device?.socket_id && (!client || client.socket_id !== device.socket_id)) {
          device?.socket_id && io.to(device?.socket_id).emit('sync-store-cart', storeState?.cart.storeCart);
        }
      });
    }
  } catch (err) {
    console.log(`syncAllStoreDevicesCart error ${JSON.stringify(err)}`);
  }
};

export const syncDeviceStoreCartOrder = (storeCode: string, orderToken: string) => {
  try {
    console.log(`sync store cart order. ${storeCode} - ${orderToken}`);
    const storeState = getStoreStateByStoreCode(storeCode);
    const storeCart = storeState?.cart?.storeCart?.find((order) => order?.order_token === orderToken);
    const guuid = storeCart?.selectedDeviceGUUID;

    if (storeState?.connectedDevices) {
      storeState?.connectedDevices.forEach((device) => {
        if (device?.device_guuid === guuid && device?.socket_id) {
          io.to(device?.socket_id).emit('sync-store-cart-order', storeCart);
        }
      });
    }
  } catch (err) {
    console.log(`syncDeviceStoreCartOrder error ${JSON.stringify(err)}`);
  }
};

export const clearCarts = (storeCode: string) => {
  try {
    console.log(`clear store carts. ${storeCode}`);
    if (SocketAppState?.storeStates?.[storeCode].cart.storeCart) {
      SocketAppState.storeStates[storeCode].cart.storeCart = [];
      syncAllStoreDevicesCart({ storeCode });
    }
  } catch (err) {
    console.log(`Clear store carts error ${JSON.stringify(err)}`);
  }
};

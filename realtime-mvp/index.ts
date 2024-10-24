import { AuthPayloadModel, ConnectedSocketClient, SocketIO } from './src/types';
import { SocketAppState, app, io, port, server } from './src/app';
import {
  onCreateStoreCart,
  onRemoveStoreCart,
  onUpdateStoreCart,
  onSelectStoreCart,
  OnUnselectStoreCart,
  onAddStoreCartItem,
  onRemoveStoreCartItem,
  onUpdateStoreCartItem,
} from './src/WebSocketEventHandlers';
import baseRouter from './src/routers/baseRouter';
import dashboardRefreshOrderRoute from './src/routers/dashboardRefreshOrder';
import { parseCognitoJwt } from './src/utils/parseJwt';
import { verifyJwt } from './src/services/auth/verifyJwt';
import { randomQrCode } from './src/utils/randomQrNumber';
import verifyQrRoute from './src/routers/verifyQrRoute';
import { disconnectSocket } from './src/websocketEvents/utils';
import { onConnect } from './src/websocketEvents/connection/onConnect';
import { onDisconnect } from './src/websocketEvents/connection/onDisconnect';
import { onUpdateDevice } from './src/websocketEvents/device';
import { showLedgePopup } from './src/websocketEvents/ledge/showLedgePopup';
import { hideLedgePopup } from './src/websocketEvents/ledge/hideLedgePopup';
import { onAddPrintJob, onRemovePrintJob, onUpdatePrintStatus } from './src/websocketEvents/print/printJob';
import { refetchDeviceData, reloadDevice, resetDevice } from './src/websocketEvents/deviceUtility';
import { purgeServerState } from './src/websocketEvents/serverUtility';
import { refetchStoreData } from './src/websocketEvents/deviceUtility/refetchStoreData';
import { onAdminGetStoreState } from './src/websocketEvents/admin/onAdminGetStoreState';
import { sendMessage } from './src/websocketEvents/message/sendMessage';
import refreshStoreMenu from './src/routers/refreshStoreMenu';
import { onUpdateConnectedDeviceWithPayload } from './src/websocketEvents/device/onUpdateConnectedDeviceWithPayload';
import { sendScannedCode } from './src/websocketEvents/scannedCode/onScanCode';
import { onAdminGetStoreScannedLogs } from './src/websocketEvents/admin/onAdminGetStoreScannedLogs';
import refreshMultipleStoreMenu from './src/routers/refreshMultipleStoreMenu';
import versionRouter from './src/routers/versionRouter';

// Routes
app.use('/', baseRouter);
app.use('/version', versionRouter);
app.use('/verify-qr', verifyQrRoute);
app.use('/order-dashboard-refresh', dashboardRefreshOrderRoute);
app.use('/refresh-store-menu', refreshStoreMenu);
app.use('/refresh-multiple-store-menu', refreshMultipleStoreMenu);

// 5 minutes
const randomTokenLifetime = 1000 * 60 * 60;

io.on('connection', async (socket: SocketIO) => {
  // If it's new device, we can skip other events and generate a random qr if device doesn't have one or it's expired
  const { accessJwtToken, device, idJwtToken, refreshToken, qrCode } = socket.handshake.auth as AuthPayloadModel;
  const parsedIdJwt = idJwtToken ? parseCognitoJwt(idJwtToken) : undefined;
  const userData = accessJwtToken ? await verifyJwt(accessJwtToken) : undefined;
  const accessibleToDashboard = userData?.['cognito:groups']?.find(
    (group) => group === 'Admin' || group === 'Marketing',
  );
  const isStoreManager = userData?.['cognito:groups']?.includes('StoreManager');
  const email = parsedIdJwt?.email;
  const expiry = parsedIdJwt?.exp;
  const username = userData?.['username'];
  const existingIdx = SocketAppState.storeManagers?.findIndex((storeManager) => storeManager?.email === email);

  if (existingIdx === -1 && accessJwtToken) {
    SocketAppState.storeManagers.push({
      email,
      accessToken: accessJwtToken,
      refreshToken,
      idToken: idJwtToken,
      username,
      tokenExpiry: expiry,
    });
  }

  if (!SocketAppState.accessToken) {
    SocketAppState.accessToken = accessJwtToken;
    SocketAppState.refreshToken = refreshToken;
    SocketAppState.tokenExpiry = expiry;
    SocketAppState.accessTokenUsername = username;
    SocketAppState.idToken = idJwtToken;
  }

  const connectedClient: ConnectedSocketClient = {
    socket_id: socket.id,
    email,
    username,
    accessibleToDashboard,
    connectedTime: Date.now(),
    device,
    roles: parsedIdJwt?.['cognito:groups'],
  };

  if (!accessJwtToken) {
    const now = Date.now();
    // qrCode && console.log('Check if qr code expired');
    console.log('generate qr code for device');

    // const notExpired = qrCode?.expiry && now < qrCode?.expiry;

    const newRandomCode = randomQrCode(13);
    const codeExistIdx = SocketAppState.temporaryIds?.findIndex((tempId) => tempId.code === newRandomCode);
    const expiry = Date.now() + randomTokenLifetime;
    if (codeExistIdx === -1) {
      SocketAppState.temporaryIds.push({
        code: newRandomCode,
        expiry,
      });
    } else {
      SocketAppState.temporaryIds[codeExistIdx].expiry = expiry;
    }
    socket.emit('generate-qr', {
      code: newRandomCode,
      expiry,
    });

    return;
  }

  if ((!userData || !isStoreManager) && !accessibleToDashboard) {
    return disconnectSocket(socket);
  }

  // On connected
  onConnect({ client: connectedClient, socket });

  // Events
  socket.on('disconnect', () => onDisconnect({ client: connectedClient, socket }));

  socket.on('update-device-settings', (newDeviceProps) => onUpdateDevice(socket, newDeviceProps));

  // Configured device events

  if (device) {
    socket.on('update-connected-device', (payload) =>
      onUpdateConnectedDeviceWithPayload({ socket, client: connectedClient, payload }),
    );
    socket.on('send-scanned-code', (code) => sendScannedCode({ client: connectedClient, socket, code }));
    socket.on('show-ledge-popups', showLedgePopup);
    socket.on('hide-ledge-popups', hideLedgePopup);
    socket.on('create-store-cart', (cart) => onCreateStoreCart({ cart, client: connectedClient, socket }));
    socket.on('update-store-cart', (cart) => onUpdateStoreCart({ cart, client: connectedClient, socket }));
    socket.on('remove-store-cart', (orderToken) => onRemoveStoreCart({ orderToken, client: connectedClient, socket }));
    socket.on('select-store-cart', (orderToken) => onSelectStoreCart({ orderToken, client: connectedClient, socket }));
    socket.on('add-store-cart-item', (orderToken, orderItem) =>
      onAddStoreCartItem({ client: connectedClient, socket, orderItem, orderToken }),
    );
    socket.on('remove-store-cart-item', (orderToken, orderItemNumber) =>
      onRemoveStoreCartItem({ client: connectedClient, socket, orderToken, orderItemNumber }),
    );
    socket.on('update-store-cart-item', (orderToken, orderItemNumber, orderItem, updateCartProps) =>
      onUpdateStoreCartItem({
        client: connectedClient,
        socket,
        orderItem,
        orderItemNumber,
        orderToken,
        updateCartProps,
      }),
    );
    socket.on('unselect-store-cart', () =>
      OnUnselectStoreCart({ client: connectedClient, socket, syncAfterCall: true }),
    );
  }

  // Message
  socket.on('message', sendMessage);

  if (!accessibleToDashboard) {
    socket.on('refetch-store-data', ({ dataType }) =>
      refetchStoreData({ storeCode: connectedClient?.device?.store_code, dataType }),
    );
    socket.on('send-print-job', ({ data, printerData, order }) =>
      onAddPrintJob({
        storeCode: connectedClient.device.store_code,
        data: data,
        printerData,
        client: connectedClient,
        socket,
        order,
      }),
    );
    socket.on('update-print-status', ({ printJobId, status }) =>
      onUpdatePrintStatus({ storeCode: connectedClient.device.store_code, printJobId, status }),
    );
    socket.on('remove-print-job', ({ printJobId }) =>
      onRemovePrintJob({ storeCode: connectedClient.device.store_code, printJobId }),
    );
  } else {
    // Admin events
    // Get store state
    socket.on('get-store-state', (storeCode) => onAdminGetStoreState({ storeCode, socket, client: connectedClient }));
    socket.on('get-store-scanned-logs', (storeCode) => onAdminGetStoreScannedLogs({ storeCode, socket, client: connectedClient }));

    // Printing
    socket.on('send-print-job', ({ storeCode, data, printerData, order }) =>
      onAddPrintJob({
        storeCode,
        data: data,
        printerData,
        client: connectedClient,
        socket,
        order,
      }),
    );
    socket.on('update-print-status', ({ storeCode, printJobId, status }) =>
      onUpdatePrintStatus({ storeCode, printJobId, status }),
    );
    socket.on('remove-print-job', ({ storeCode, printJobId }) => onRemovePrintJob({ storeCode, printJobId }));

    // Device management
    socket.on('reload-device', reloadDevice);
    socket.on('reset-device', resetDevice);
    socket.on('refetch', refetchDeviceData);
    socket.on('refetch-store-data', ({ dataType, storeCode }) => refetchStoreData({ storeCode, dataType }));
    socket.on('purge-state', purgeServerState);
  }
});

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

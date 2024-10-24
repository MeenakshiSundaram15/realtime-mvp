import { SocketAppState, io } from '../../app';
import { MessageEventType, MessageType } from '../../types';

export const sendMessage = (payload: {
  type: MessageType;
  eventType: MessageEventType;
  data: any;
  receiverGuuid: string;
}) => {
  const { receiverGuuid, ...rest } = payload;

  if (payload?.eventType === 'print') {
    const msg = payload?.data?.msg;
    const msgType = payload?.data?.msgType;
    const result = payload?.data?.result;
    const status = payload?.type;
    const dataObject = {
      ...(msg ? { msg } : {}),
      ...(msgType ? { msgType } : {}),
      ...(result ? { result } : {}),
      ...(status ? { status } : {}),
    };

    console.log(`send message payload to receiver (${receiverGuuid}) with data: ${JSON.stringify(dataObject)}`);
  } else {
    console.log(`send message payload to receiver (${receiverGuuid})`);
  }

  const receiverClients = SocketAppState.connectedClients?.filter(
    (client) => client?.device?.device_guuid === receiverGuuid
  );

  if (!receiverClients.length) {
    console.log(`Unable to find device socket id for receiverGuuid: ${receiverGuuid}`);
    console.log(`Payload: ${JSON.stringify(payload)}`);
    console.log(`existing connected clients: ${JSON.stringify(SocketAppState.connectedClients)}`);
  }

  if (receiverClients.length) {
    receiverClients.forEach((receiver) => {
      if (receiver.socket_id) {
        io.to(receiver.socket_id).emit('message', rest);
      }
    });
  }
};

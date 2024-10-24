import axios from 'axios';
import { connectorAPIUrl } from './shared';
import { SocketAppState } from '../../app';
import { renewToken } from '../../utils/renewToken';

const oneDay = 1000 * 60 * 60 * 24;

type DeviceStatusPayload = {
  device_guuid: string;
  is_active: boolean;
  socket_id?: string;
};

export const updateDeviceStatus = async (params: DeviceStatusPayload) => {
  const updateDeviceStatusParams = params;
  const { device_guuid, is_active, socket_id } = params;
  console.log(`Updating status: ${device_guuid} to ${is_active ? 'Active' : 'Inactive'}`);
  const res = await axios
    .put<string>(
      // `${connectorAPIUrl}/api/dl/device-id/update`, authenticated path
      `${connectorAPIUrl}/api/dl/open/device-id/update`,
      {
        device_guuid,
        is_active,
        socket_id,
      },
      {
        headers: {
          authorization: SocketAppState.accessToken,
        },
      },
    )
    .catch(async (error: any) => {
      const message = error?.response?.data?.message;
      console.log('error update connection status', JSON.stringify(error));
      const isExpired = message?.includes('expired');

      if (isExpired) {
        console.log('Token expired, renewing...');
        const renewSuccess = await renewToken({
          idToken: SocketAppState.idToken,
          accessToken: SocketAppState.accessToken,
          refreshToken: SocketAppState.refreshToken,
        }).catch((error) => {
          console.log('Error trying to renew token', JSON.stringify(error));
        });

        if (renewSuccess) {
          console.log('Token renewed!');
          updateDeviceStatus(updateDeviceStatusParams);
        }
      }
    });
  return res;
};

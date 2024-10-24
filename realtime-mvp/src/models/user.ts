export type ClientModel = {
  endpoint: string;
  fetchOptions: any;
};

export type QRCodeModel = {
  code: string;
  expiry: number;
};

export type StorageModel = {
  [key: string]: any;
  length: number;
};

export type AccessTokenModel = {
  jwtToken: string;
  payload: {
    auth_time: number;
    client_id: string;
    'cognito:groups': string[];
    event_id: string;
    exp: number;
    int: number;
    iss: string;
    jti: string;
    origin_jti: string;
    scope: string;
    sub: string;
    token_use: string;
    username: string;
  };
};

export type StoreManagerModel = {
  email: string;
  username: string;
  accessToken: string;
  refreshToken: string;
  idToken: string;
  tokenExpiry: number;
};

export type UserModel = {
  username: string;
  userDataKey: string;
  email: string;
  email_verified: boolean;
  sub: string;
  endpoint: string;
  keyPrefix: string;
  authenticationFlowType: 'USER_SRP_AUTH' | 'USER_PASSWORD_AUTH' | 'CUSTOM_AUTH';
  client: ClientModel;
  pool: {
    advancedSecurityDataCollectionFlag: boolean;
    client: ClientModel;
    clientId: string;
    storage: StorageModel;
    userPoolId: string;
    wrapRefreshSessionCalback: () => void;
  };
  signInUserSession: {
    accessToken: AccessTokenModel;
    idToken: AccessTokenModel;
    refreshToken: {
      token: string;
    };
    clockDrift: number;
  };
};

export type AuthResponseModel = {
  username: string;
  userDataKey: string;
  attributes: {
    email: string;
    email_verified: boolean;
    sub: string;
  };
  authenticationFlowType: 'USER_SRP_AUTH' | 'USER_PASSWORD_AUTH' | 'CUSTOM_AUTH';
  client: ClientModel;
  keyPrefix: string;
  pool: {
    advancedSecurityDataCollectionFlag: boolean;
    client: ClientModel;
    clientId: string;
    storage: StorageModel;
    userPoolId: string;
    wrapRefreshSessionCalback: () => void;
  };
  signInUserSession: {
    accessToken: AccessTokenModel;
    idToken: AccessTokenModel;
    refreshToken: {
      token: string;
    };
    clockDrift: number;
  };
};

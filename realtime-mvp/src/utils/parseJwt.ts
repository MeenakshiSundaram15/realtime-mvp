type CognitoJwtData = {
  sub: string;
  ['cognito:groups']: string[];
  email_verified: boolean;
  iss: string;
  ['cognito:username']: string;
  ['origin_jti']: string;
  aud: string;
  event_id: string;
  token_use: string;
  auth_time: string;
  exp: number;
  iat: number;
  jti: string;
  email: string;
};

export const parseCognitoJwt = (token: string): CognitoJwtData => {
  return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
};

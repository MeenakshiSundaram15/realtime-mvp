import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';
import type { CognitoUser } from 'amazon-cognito-identity-js';
import { SocketAppState } from '../app';

export const poolConfig = {
  userPoolId: process.env.AUTH_USERPOOL_ID,
  clientId: process.env.AUTH_CLIENT_ID,
};

export const renewToken = async (authData: {
  idToken: string;
  accessToken: string;
  refreshToken: string;
}): Promise<CognitoUser | any> => {
  // create a CognitoAccessToken using the response accessToken
  const AccessToken = new AmazonCognitoIdentity.CognitoAccessToken({
    AccessToken: authData.accessToken,
  });

  // create a CognitoIdToken using the response idToken
  const IdToken = new AmazonCognitoIdentity.CognitoIdToken({
    IdToken: authData.idToken,
  });

  // create a RefreshToken using the response refreshToken
  const RefreshToken = new AmazonCognitoIdentity.CognitoRefreshToken({
    RefreshToken: authData.refreshToken,
  });

  // create a session object with all the tokens
  const sessionData = {
    IdToken: IdToken,
    AccessToken: AccessToken,
    RefreshToken: RefreshToken,
  };

  // create the CognitoUserSession using the sessionData
  const session = new AmazonCognitoIdentity.CognitoUserSession(sessionData);

  // create an object with the UserPoolId and ClientId
  let poolData = {
    UserPoolId: poolConfig.userPoolId,
    ClientId: poolConfig.clientId,
  };

  // pass the poolData object to CognitoUserPool
  let userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

  // create an object containing the username and user pool.
  // You can get the username from CognitoAccessToken object
  // we created above.
  let userData = {
    Username: AccessToken.payload.username,
    Pool: userPool,
  };

  // create a cognito user using the userData object
  let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

  // set the cognito user session w/ the CognitoUserSession
  cognitoUser.setSignInUserSession(session);

  return new Promise((resolve, reject) => {
    cognitoUser.refreshSession(session.getRefreshToken(), (err, session) => {
      if (err) {
        console.log('Token refresh failed:', err);
        reject(false);
      } else {
        console.log('Token refresh successful:', session.getAccessToken().getJwtToken());
        SocketAppState.accessToken = session.getAccessToken().getJwtToken();
        SocketAppState.tokenExpiry = session.getAccessToken().getExpiration();
        SocketAppState.refreshToken = session.getRefreshToken();
        resolve(true);
      }
    });
  });
};

import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
  signInWithCredential,
  type UserCredential,
} from 'firebase/auth';
import { Platform } from 'react-native';
import {
  FACEBOOK_APP_ID,
  FACEBOOK_CLIENT_TOKEN,
  GOOGLE_IOS_CLIENT_ID,
  GOOGLE_WEB_CLIENT_ID,
} from '../config';
import { firebaseAuth } from './firebase';

type AuthError = Error & { code: string };

const authError = (code: string, message: string): AuthError => {
  const error = new Error(message) as AuthError;
  error.code = code;
  return error;
};

let googleConfigured = false;
let googleLoaded = false;
let facebookLoaded = false;

const loadGoogle = async () => {
  try {
    const sdk = await import('@react-native-google-signin/google-signin');
    googleLoaded = true;
    return sdk;
  } catch {
    throw authError('auth/native-build-required', 'Rebuild the app to enable Google sign-in.');
  }
};

const loadFacebook = async () => {
  try {
    const sdk = await import('react-native-fbsdk-next');
    facebookLoaded = true;
    return sdk;
  } catch {
    throw authError('auth/native-build-required', 'Rebuild the app to enable Facebook sign-in.');
  }
};

const configureGoogle = async () => {
  if (googleConfigured) return;
  if (!GOOGLE_WEB_CLIENT_ID) {
    throw authError('auth/missing-configuration', 'Missing Google web client ID.');
  }
  if (Platform.OS === 'ios' && !GOOGLE_IOS_CLIENT_ID) {
    throw authError('auth/missing-configuration', 'Missing Google iOS client ID.');
  }

  const { GoogleSignin } = await loadGoogle();
  GoogleSignin.configure({
    webClientId: GOOGLE_WEB_CLIENT_ID,
    ...(GOOGLE_IOS_CLIENT_ID ? { iosClientId: GOOGLE_IOS_CLIENT_ID } : {}),
    offlineAccess: false,
  });
  googleConfigured = true;
};

export const signInWithGoogleProvider = async (): Promise<UserCredential> => {
  await configureGoogle();
  const { GoogleSignin, isSuccessResponse } = await loadGoogle();
  if (Platform.OS === 'android') {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  }

  const response = await GoogleSignin.signIn();
  if (!isSuccessResponse(response)) {
    throw authError('auth/cancelled', 'Google sign-in was cancelled.');
  }

  const idToken = response.data.idToken;
  if (!idToken) {
    throw authError('auth/invalid-credential', 'Google did not return an ID token.');
  }

  return signInWithCredential(
    firebaseAuth,
    GoogleAuthProvider.credential(idToken)
  );
};

export const signInWithFacebookProvider = async (): Promise<UserCredential> => {
  if (!FACEBOOK_APP_ID || !FACEBOOK_CLIENT_TOKEN) {
    throw authError('auth/missing-configuration', 'Missing Facebook app ID.');
  }

  const { AccessToken, AuthenticationToken, LoginManager, Settings } = await loadFacebook();
  Settings.initializeSDK();
  // Limited Login returns an OIDC ID token on iOS, not a Graph API access token.
  const crypto = Platform.OS === 'ios' ? await import('expo-crypto') : null;
  const rawNonce = crypto?.randomUUID();
  const hashedNonce = rawNonce && crypto
    ? await crypto.digestStringAsync(crypto.CryptoDigestAlgorithm.SHA256, rawNonce)
    : undefined;
  const result = await LoginManager.logInWithPermissions(
    ['public_profile', 'email'],
    Platform.OS === 'ios' ? 'limited' : 'enabled',
    hashedNonce
  );
  if (result.isCancelled) {
    throw authError('auth/cancelled', 'Facebook sign-in was cancelled.');
  }

  if (Platform.OS === 'ios') {
    const token = await AuthenticationToken.getAuthenticationTokenIOS();
    if (!token?.authenticationToken || !rawNonce) {
      throw authError('auth/provider-token-missing', 'Facebook did not return an ID token.');
    }
    return signInWithCredential(firebaseAuth, new OAuthProvider('facebook.com').credential({
      idToken: token.authenticationToken,
      rawNonce,
    }));
  }

  const token = await AccessToken.getCurrentAccessToken();
  if (!token?.accessToken) {
    throw authError('auth/invalid-credential', 'Facebook did not return an access token.');
  }

  return signInWithCredential(
    firebaseAuth,
    FacebookAuthProvider.credential(token.accessToken)
  );
};

export const signOutProviders = async () => {
  try {
    if (googleLoaded) {
      const { GoogleSignin } = await loadGoogle();
      await GoogleSignin.signOut();
    }
  } catch {
    // A Google session may not exist when the user signed in another way.
  }

  try {
    if (facebookLoaded) {
      const { LoginManager } = await loadFacebook();
      LoginManager.logOut();
    }
  } catch {
    // A Facebook session may not exist when the user signed in another way.
  }
};

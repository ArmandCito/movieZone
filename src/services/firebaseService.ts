import { FirebaseError } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { firebaseAuth } from './firebase';

export const signUpWithEmail = async (
  email: string,
  password: string,
  displayName?: string
) => {
  const credential = await createUserWithEmailAndPassword(
    firebaseAuth,
    email.trim(),
    password
  );

  if (displayName) {
    await updateProfile(credential.user, { displayName });
    // Refresh observers after the profile fields have been populated.
    await credential.user.getIdToken(true);
  }

  return credential.user;
};

export const signInWithEmail = async (email: string, password: string) => {
  const credential = await signInWithEmailAndPassword(
    firebaseAuth,
    email.trim(),
    password
  );
  return credential.user;
};

const errorMessages: Record<string, string> = {
  'auth/account-exists-with-different-credential':
    'This email already uses another sign-in method. Sign in with that provider first.',
  'auth/cancelled': 'Sign-in was cancelled.',
  'auth/cancelled-popup-request': 'Sign-in was cancelled.',
  'auth/email-already-in-use': 'An account with this email already exists.',
  'auth/invalid-credential': 'Unable to verify your sign-in. Check your details and try again.',
  'auth/user-not-found': 'The email or password is incorrect.',
  'auth/wrong-password': 'The email or password is incorrect.',
  'auth/unauthorized-domain': 'Sign-in is unavailable on this website. Please contact support.',
  'auth/native-build-required': 'This app build does not include social sign-in. Please use an updated development or release build.',
  'auth/provider-token-missing': 'The provider did not complete sign-in. Please try again.',
  SIGN_IN_CANCELLED: 'Sign-in was cancelled.',
  IN_PROGRESS: 'Sign-in is already in progress.',
  PLAY_SERVICES_NOT_AVAILABLE: 'Google Play Services is required for Google sign-in.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/missing-configuration': 'This sign-in method has not been configured yet.',
  'auth/network-request-failed': 'Network error. Check your connection and try again.',
  'auth/operation-not-allowed': 'This sign-in method is not enabled in Firebase.',
  'auth/popup-blocked': 'The sign-in popup was blocked. Please allow popups and try again.',
  'auth/popup-closed-by-user': 'Sign-in was cancelled.',
  'auth/too-many-requests': 'Too many attempts. Please try again later.',
  'auth/user-disabled': 'This account has been disabled.',
  'auth/weak-password': 'Password should be at least 6 characters.',
};

export const formatFirebaseError = (error: unknown): string => {
  if (error instanceof FirebaseError) {
    return errorMessages[error.code] || 'Sign-in failed. Please try again.';
  }

  if (typeof error === 'object' && error && 'code' in error) {
    const code = String(error.code);
    return errorMessages[code] || 'Sign-in failed. Please try again.';
  }

  if (error instanceof Error) {
    return errorMessages[error.message] || error.message;
  }

  return 'Something went wrong. Please try again.';
};

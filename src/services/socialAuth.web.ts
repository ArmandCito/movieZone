import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  type UserCredential,
} from 'firebase/auth';
import { firebaseAuth } from './firebase';

export const signInWithGoogleProvider = (): Promise<UserCredential> => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  return signInWithPopup(firebaseAuth, provider);
};

export const signInWithFacebookProvider = (): Promise<UserCredential> => {
  const provider = new FacebookAuthProvider();
  provider.addScope('email');
  return signInWithPopup(firebaseAuth, provider);
};

export const signOutProviders = async () => {
  // Firebase signOut is sufficient on the web. Provider sessions remain provider-owned.
};

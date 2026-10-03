import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { onIdTokenChanged, signOut as firebaseSignOut, type User } from 'firebase/auth';
import { firebaseAuth } from '../services/firebase';
import {
  signInWithFacebookProvider,
  signInWithGoogleProvider,
  signOutProviders,
} from '../services/socialAuth';

export interface AuthUser {
  localId: string;
  email: string;
  displayName?: string;
  photoUrl?: string;
  creationTime?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isInitializing: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mapFirebaseUser = (user: User): AuthUser => ({
  localId: user.uid,
  email: user.email || '',
  ...(user.displayName ? { displayName: user.displayName } : {}),
  ...(user.photoURL ? { photoUrl: user.photoURL } : {}),
  ...(user.metadata.creationTime ? { creationTime: user.metadata.creationTime } : {}),
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    return onIdTokenChanged(firebaseAuth, (firebaseUser) => {
      setUser(firebaseUser ? mapFirebaseUser(firebaseUser) : null);
      setIsInitializing(false);
    });
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isInitializing,
      signInWithGoogle: async () => {
        await signInWithGoogleProvider();
      },
      signInWithFacebook: async () => {
        await signInWithFacebookProvider();
      },
      signOut: async () => {
        await signOutProviders();
        await firebaseSignOut(firebaseAuth);
      },
    }),
    [isInitializing, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

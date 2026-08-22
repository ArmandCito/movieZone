import {
  FIREBASE_SIGN_UP_URL,
  FIREBASE_SIGN_IN_URL,
  FIREBASE_USER_INFO_URL,
  FIREBASE_API_KEY,
} from '../config';

export const signUpWithEmail = async (
  email: string,
  password: string,
  displayName?: string
) => {
  const response = await fetch(FIREBASE_SIGN_UP_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      password,
      returnSecureToken: true,
      ...(displayName ? { displayName } : {}),
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || 'Sign up failed');
  }
  return data;
};

export const signInWithEmail = async (
  email: string,
  password: string
) => {
  const response = await fetch(FIREBASE_SIGN_IN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      password,
      returnSecureToken: true,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || 'Sign in failed');
  }
  return data;
};

export const getUserInfo = async (idToken: string) => {
  const response = await fetch(FIREBASE_USER_INFO_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || 'Failed to get user info');
  }
  return data;
};

// Sign in with a Google ID token (exchanged via Google Identity Services)
export const signInWithGoogleToken = async (googleIdToken: string) => {
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithIdp?key=${FIREBASE_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        postId: `id_token=${googleIdToken}&providerId=google.com`,
        requestUri: 'http://localhost:8081',
        returnIdpCredential: true,
        returnSecureToken: true,
      }),
    }
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || 'Google sign in failed');
  }
  return data;
};

export const formatFirebaseError = (error: string): string => {
  const errorMap: Record<string, string> = {
    'EMAIL_EXISTS': 'An account with this email already exists.',
    'EMAIL_NOT_FOUND': 'No account found with this email.',
    'INVALID_PASSWORD': 'Incorrect password. Please try again.',
    'INVALID_EMAIL': 'Please enter a valid email address.',
    'USER_DISABLED': 'This account has been disabled.',
    'WEAK_PASSWORD': 'Password should be at least 6 characters.',
    'MISSING_PASSWORD': 'Please enter your password.',
    'MISSING_EMAIL': 'Please enter your email.',
    'TOO_MANY_ATTEMPTS_TRY_LATER': 'Too many attempts. Please try again later.',
    'OPERATION_NOT_ALLOWED': 'This operation is not allowed.',
    'POPUP_CLOSED': 'Google sign-in window was closed.',
    'POPUP_BLOCKED': 'Google sign-in was blocked. Please allow popups for this site.',
  };
  return errorMap[error] || error.replace(/_/g, ' ').toLowerCase();
};
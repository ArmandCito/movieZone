const requiredEnv = (name: string, value: string | undefined): string => {
	if (!value) {
		throw new Error(`Missing environment variable: ${name}`);
	}
	return value;
};

// API Configuration
export const TMDB_API_KEY = requiredEnv('EXPO_PUBLIC_TMDB_API_KEY', process.env.EXPO_PUBLIC_TMDB_API_KEY);
export const TMDB_TOKEN = requiredEnv('EXPO_PUBLIC_TMDB_TOKEN', process.env.EXPO_PUBLIC_TMDB_TOKEN);
export const TMDB_API_URL = process.env.EXPO_PUBLIC_TMDB_API_URL || 'https://api.themoviedb.org/3/';
export const TMDB_IMAGE_URL = process.env.EXPO_PUBLIC_TMDB_IMAGE_URL || 'https://image.tmdb.org/t/p/';

// Firebase Configuration
export const FIREBASE_API_KEY = requiredEnv('EXPO_PUBLIC_FIREBASE_API_KEY', process.env.EXPO_PUBLIC_FIREBASE_API_KEY);
export const FIREBASE_AUTH_DOMAIN = requiredEnv('EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN', process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN);
export const FIREBASE_PROJECT_ID = requiredEnv('EXPO_PUBLIC_FIREBASE_PROJECT_ID', process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID);
export const FIREBASE_STORAGE_BUCKET = requiredEnv('EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET', process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET);
export const FIREBASE_MESSAGING_SENDER_ID = requiredEnv('EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID', process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID);
export const FIREBASE_APP_ID = requiredEnv('EXPO_PUBLIC_FIREBASE_APP_ID', process.env.EXPO_PUBLIC_FIREBASE_APP_ID);

// Firebase REST API endpoints
export const FIREBASE_SIGN_UP_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_API_KEY}`;
export const FIREBASE_SIGN_IN_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`;
export const FIREBASE_USER_INFO_URL = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${FIREBASE_API_KEY}`;
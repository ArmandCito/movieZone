// API Configuration
export const TMDB_API_KEY = '51e0e93a293a56c797a72c9bcfbf43f9';
export const TMDB_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MWUwZTkzYTI5M2E1NmM3OTdhNzJjOWJjZmJmNDNmOSIsIm5iZiI6MTc4NTkxNTk0OC44MjgsInN1YiI6IjZhNzJlYTJjNDUzZjk4MjdhNTEyNDBhNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.c686Ahypt0hWG4st0GgQL8Vd-4LNYeGdeLOppPL3zlg.c686Ahypt0hWG4st0GgQL8Vd-4LNYeGdeLOppPL3zlg';
export const TMDB_API_URL = 'https://api.themoviedb.org/3/';
export const TMDB_IMAGE_URL = 'https://image.tmdb.org/t/p/';

// Firebase Configuration
export const FIREBASE_API_KEY = 'AIzaSyANbbwMp68mR_yqfETKZUdL4bm-aMcmTRQ';
export const FIREBASE_AUTH_DOMAIN = 'weather-with-oauth.firebaseapp.com';
export const FIREBASE_PROJECT_ID = 'weather-with-oauth';
export const FIREBASE_STORAGE_BUCKET = 'weather-with-oauth.firebasestorage.app';
export const FIREBASE_MESSAGING_SENDER_ID = '103725081854';
export const FIREBASE_APP_ID = '1:103725081854:web:6db5b77b49a4ad2075f1af';

// Firebase REST API endpoints
export const FIREBASE_SIGN_UP_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_API_KEY}`;
export const FIREBASE_SIGN_IN_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`;
export const FIREBASE_USER_INFO_URL = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${FIREBASE_API_KEY}`;
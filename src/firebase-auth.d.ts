import 'firebase/auth';
import type { Persistence } from 'firebase/auth';

interface ReactNativeStorage {
  setItem(key: string, value: string): Promise<void>;
  getItem(key: string): Promise<string | null>;
  removeItem(key: string): Promise<void>;
}

declare module 'firebase/auth' {
  export function getReactNativePersistence(storage: ReactNativeStorage): Persistence;
}

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import type { Storage } from 'redux-persist';

/**
 * redux-persist storage for the auth token. SecureStore (Keychain / Keystore) on native; it isn't
 * supported on web, so web falls back to AsyncStorage (localStorage).
 */
/** SecureStore only allows alphanumerics, ".", "-" and "_", but redux-persist keys look like "persist:auth". */
const safeKey = (key: string) => key.replace(/[^\w.-]/g, '.');

export const secureStorage: Storage =
  Platform.OS === 'web'
    ? AsyncStorage
    : {
        getItem: (key) => SecureStore.getItemAsync(safeKey(key)),
        setItem: (key, value) => SecureStore.setItemAsync(safeKey(key), value),
        removeItem: (key) => SecureStore.deleteItemAsync(safeKey(key)),
      };

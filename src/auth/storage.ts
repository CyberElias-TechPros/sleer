import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';
import { createSecureSessionStorage } from './secureStorageCore';

const encrypted = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};
// Web is not a supported production target. Native secure storage never falls
// back to plaintext on error; existing AsyncStorage sessions migrate on read.
export const sessionStorage = Platform.OS === 'web' ? AsyncStorage : createSecureSessionStorage(encrypted, AsyncStorage, Crypto.randomUUID);

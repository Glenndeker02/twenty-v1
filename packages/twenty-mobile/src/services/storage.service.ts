import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthTokenPair } from '../types/auth';

const STORAGE_KEYS = {
  AUTH_TOKENS: 'twenty_auth_tokens',
  WORKSPACE_ID: 'twenty_workspace_id',
  USER_DATA: 'twenty_user_data',
};

export class StorageService {
  // Secure storage for sensitive data (tokens)
  static async setAuthTokens(tokens: AuthTokenPair): Promise<void> {
    try {
      await SecureStore.setItemAsync(
        STORAGE_KEYS.AUTH_TOKENS,
        JSON.stringify(tokens)
      );
    } catch (error) {
      console.error('Error storing auth tokens:', error);
      throw error;
    }
  }

  static async getAuthTokens(): Promise<AuthTokenPair | null> {
    try {
      const tokens = await SecureStore.getItemAsync(STORAGE_KEYS.AUTH_TOKENS);
      return tokens ? JSON.parse(tokens) : null;
    } catch (error) {
      console.error('Error retrieving auth tokens:', error);
      return null;
    }
  }

  static async removeAuthTokens(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH_TOKENS);
    } catch (error) {
      console.error('Error removing auth tokens:', error);
    }
  }

  // Regular async storage for non-sensitive data
  static async setWorkspaceId(workspaceId: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.WORKSPACE_ID, workspaceId);
    } catch (error) {
      console.error('Error storing workspace ID:', error);
    }
  }

  static async getWorkspaceId(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.WORKSPACE_ID);
    } catch (error) {
      console.error('Error retrieving workspace ID:', error);
      return null;
    }
  }

  static async setUserData(userData: any): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.USER_DATA,
        JSON.stringify(userData)
      );
    } catch (error) {
      console.error('Error storing user data:', error);
    }
  }

  static async getUserData(): Promise<any | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error retrieving user data:', error);
      return null;
    }
  }

  static async clearAll(): Promise<void> {
    try {
      await Promise.all([
        SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH_TOKENS),
        AsyncStorage.removeItem(STORAGE_KEYS.WORKSPACE_ID),
        AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA),
      ]);
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }
}

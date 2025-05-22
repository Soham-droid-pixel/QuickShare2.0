import * as SecureStore from 'expo-secure-store';
import { ProfessionalInfo, AppSettings } from '../types';

const KEYS = {
  PROFESSIONAL_INFO: 'professional_info',
  APP_SETTINGS: 'app_settings',
  PASSCODE: 'passcode',
} as const;

export const secureStorage = {
  // Professional Info
  async saveProfessionalInfo(info: ProfessionalInfo): Promise<void> {
    try {
      await SecureStore.setItemAsync(KEYS.PROFESSIONAL_INFO, JSON.stringify(info));
    } catch (error) {
      console.error('Error saving professional info:', error);
      throw error;
    }
  },

  async getProfessionalInfo(): Promise<ProfessionalInfo | null> {
    try {
      const data = await SecureStore.getItemAsync(KEYS.PROFESSIONAL_INFO);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting professional info:', error);
      return null;
    }
  },

  // App Settings
  async saveAppSettings(settings: AppSettings): Promise<void> {
    try {
      await SecureStore.setItemAsync(KEYS.APP_SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving app settings:', error);
      throw error;
    }
  },

  async getAppSettings(): Promise<AppSettings | null> {
    try {
      const data = await SecureStore.getItemAsync(KEYS.APP_SETTINGS);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting app settings:', error);
      return null;
    }
  },

  // Passcode
  async savePasscode(passcode: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(KEYS.PASSCODE, passcode);
    } catch (error) {
      console.error('Error saving passcode:', error);
      throw error;
    }
  },

  async getPasscode(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(KEYS.PASSCODE);
    } catch (error) {
      console.error('Error getting passcode:', error);
      return null;
    }
  },

  async verifyPasscode(inputPasscode: string): Promise<boolean> {
    try {
      const storedPasscode = await this.getPasscode();
      return storedPasscode === inputPasscode;
    } catch (error) {
      console.error('Error verifying passcode:', error);
      return false;
    }
  },

  // Clear all data (useful for development/reset)
  async clearAll(): Promise<void> {
    try {
      await Promise.all([
        SecureStore.deleteItemAsync(KEYS.PROFESSIONAL_INFO),
        SecureStore.deleteItemAsync(KEYS.APP_SETTINGS),
        SecureStore.deleteItemAsync(KEYS.PASSCODE),
      ]);
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  },
};
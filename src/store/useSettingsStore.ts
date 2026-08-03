import { create } from 'zustand';
import type { AppSettings } from '../types';

interface SettingsState {
  settings: AppSettings;
  setTableNumber: (table: string) => void;
  setStoreId: (storeId: string) => void;
  resetSettings: () => void;
}

const DEFAULT_SETTINGS: AppSettings = {
  tableNumber: '',
  storeId: '',
};

export const useSettingsStore = create<SettingsState>()((set) => ({
  settings: DEFAULT_SETTINGS,
  setTableNumber: (tableNumber) =>
    set((state) => ({
      settings: { ...state.settings, tableNumber },
    })),
  setStoreId: (storeId) =>
    set((state) => ({
      settings: { ...state.settings, storeId },
    })),
  resetSettings: () => set({ settings: DEFAULT_SETTINGS }),
}));
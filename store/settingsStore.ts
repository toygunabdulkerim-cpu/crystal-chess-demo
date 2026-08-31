// Settings Store
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserSettings } from '@/types';
import { DEFAULT_SETTINGS } from '@/store/userStore';

interface SettingsStore {
  settings: UserSettings;
  updateSettings: (settings: Partial<UserSettings>) => void;
  resetSettings: () => void;
  toggleSetting: <K extends keyof UserSettings>(key: K) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      settings: DEFAULT_SETTINGS,

      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),

      resetSettings: () => set({ settings: DEFAULT_SETTINGS }),

      toggleSetting: (key) =>
        set((state) => ({
          settings: {
            ...state.settings,
            [key]: !state.settings[key],
          },
        })),
    }),
    {
      name: 'crystal-chess-settings',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    }
  )
);
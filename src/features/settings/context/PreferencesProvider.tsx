import { createContext, ReactNode } from 'react';
import { useLocalStorage } from '@/shared/hooks';
import type { UserPreferences } from '../types/settings.types';

const DEFAULT_PREFERENCES: UserPreferences = {
  themeMode: 'system',
  language: 'en',
  sidebarDefaultCollapsed: false,
};

const PREFERENCES_STORAGE_KEY = 'userPreferences';

export interface PreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (patch: Partial<UserPreferences>) => void;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

interface PreferencesProviderProps {
  children: ReactNode;
}

/**
 * A single, shared source of truth for user preferences (device-local, not
 * backend data) - both the Settings page and app chrome (theme, sidebar)
 * read/write through this same context. Two independent useLocalStorage
 * calls for the same key would each hold their own React state and silently
 * fall out of sync with each other; routing everything through one provider
 * avoids that.
 */
export const PreferencesProvider = ({ children }: PreferencesProviderProps) => {
  const [preferences, setPreferences] = useLocalStorage<UserPreferences>(PREFERENCES_STORAGE_KEY, DEFAULT_PREFERENCES);

  const updatePreferences = (patch: Partial<UserPreferences>) => {
    setPreferences({ ...preferences, ...patch });
  };

  return (
    <PreferencesContext.Provider value={{ preferences, updatePreferences }}>
      {children}
    </PreferencesContext.Provider>
  );
};

export default PreferencesContext;

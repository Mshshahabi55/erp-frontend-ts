import { useMediaQuery } from '@/shared/hooks';
import type { ColorSchemeMode } from '@/config/theme.config';
import { usePreferences } from './usePreferences';

/** Resolves the 'system' preference down to an actual light/dark value the theme can use. */
export const useEffectiveThemeMode = (): ColorSchemeMode => {
  const { preferences } = usePreferences();
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');

  if (preferences.themeMode === 'system') {
    return prefersDark ? 'dark' : 'light';
  }
  return preferences.themeMode;
};

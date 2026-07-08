export interface CompanySettings {
  name: string;
  email: string;
  phone: string;
  address: string;
  taxId: string;
  /** A data URL (this mock backend has no real file storage) - see shared/uploads. */
  logoUrl?: string;
}

export type UpdateCompanySettingsDto = Partial<CompanySettings>;

export type SupportedCurrency = 'USD' | 'EUR' | 'GBP';
export type SupportedDateFormat = 'short' | 'long' | 'iso';

export interface ApplicationSettings {
  defaultPageSize: number;
  lowStockThreshold: number;
  defaultCurrency: SupportedCurrency;
  dateFormat: SupportedDateFormat;
}

export type UpdateApplicationSettingsDto = Partial<ApplicationSettings>;

export const THEME_MODES = ['light', 'dark', 'system'] as const;
export type ThemeMode = (typeof THEME_MODES)[number];

export const LANGUAGES = ['en', 'es', 'fr'] as const;
export type Language = (typeof LANGUAGES)[number];

export interface UserPreferences {
  themeMode: ThemeMode;
  /** Selectable and persisted, but the app has no i18n library yet - UI text stays English regardless of this value. */
  language: Language;
  sidebarDefaultCollapsed: boolean;
}

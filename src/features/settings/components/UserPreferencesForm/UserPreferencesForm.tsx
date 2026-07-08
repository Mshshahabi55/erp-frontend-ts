import {
  Box,
  Paper,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
  SelectChangeEvent,
  Switch,
} from '@mui/material';
import { usePreferences } from '../../hooks/usePreferences';
import { LANGUAGES, type Language, type ThemeMode } from '../../types/settings.types';

const LANGUAGE_LABELS: Record<Language, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
};

export const UserPreferencesForm = () => {
  const { preferences, updatePreferences } = usePreferences();

  const handleThemeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updatePreferences({ themeMode: event.target.value as ThemeMode });
  };

  const handleLanguageChange = (event: SelectChangeEvent) => {
    updatePreferences({ language: event.target.value as Language });
  };

  const handleSidebarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updatePreferences({ sidebarDefaultCollapsed: event.target.checked });
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h6" component="h2" sx={{ fontWeight: 600, mb: 3 }}>
        Preferences
      </Typography>

      <Box sx={{ mb: 4 }}>
        <FormControl>
          <FormLabel id="theme-mode-label">Theme</FormLabel>
          <RadioGroup
            aria-labelledby="theme-mode-label"
            value={preferences.themeMode}
            onChange={handleThemeChange}
            row
          >
            <FormControlLabel value="light" control={<Radio />} label="Light" />
            <FormControlLabel value="dark" control={<Radio />} label="Dark" />
            <FormControlLabel value="system" control={<Radio />} label="Match system" />
          </RadioGroup>
        </FormControl>
      </Box>

      <Box sx={{ mb: 4 }}>
        <FormControl sx={{ minWidth: 220 }}>
          <FormLabel id="language-label" sx={{ mb: 1 }}>
            Language
          </FormLabel>
          <Select
            labelId="language-label"
            value={preferences.language}
            onChange={handleLanguageChange}
            size="small"
          >
            {LANGUAGES.map((language) => (
              <MenuItem key={language} value={language}>
                {LANGUAGE_LABELS[language]}
              </MenuItem>
            ))}
          </Select>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
            Saved with your account, but the interface is English-only for now.
          </Typography>
        </FormControl>
      </Box>

      <Box>
        <FormControlLabel
          control={<Switch checked={preferences.sidebarDefaultCollapsed} onChange={handleSidebarChange} />}
          label="Collapse sidebar by default"
        />
      </Box>
    </Paper>
  );
};

import { createTheme, Theme } from '@mui/material';

export type ColorSchemeMode = 'light' | 'dark';

/** Builds the app theme for a given color scheme - kept as a factory rather than a fixed object so Settings' theme toggle can actually change what renders. */
export const getTheme = (mode: ColorSchemeMode): Theme =>
  createTheme({
    palette: {
      mode,
      primary: { main: '#1976d2' },
      secondary: { main: '#9c27b0' },
      ...(mode === 'light'
        ? { background: { default: '#f5f7fa', paper: '#ffffff' } }
        : { background: { default: '#121212', paper: '#1e1e1e' } }),
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      button: { textTransform: 'none' },
    },
    shape: { borderRadius: 8 },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            margin: 0,
            padding: 0,
          },
        },
      },
    },
  });

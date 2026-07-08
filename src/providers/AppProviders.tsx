import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/features/auth/context/AuthProvider';
import { PreferencesProvider } from '@/features/settings/context/PreferencesProvider';
import { useEffectiveThemeMode } from '@/features/settings/hooks/useEffectiveThemeMode';
import { queryClient } from '@/config/react-query.config';
import { getTheme } from '@/config/theme.config';
import { environment } from '@/config/environment';

interface ThemedAppProps {
  children: React.ReactNode;
}

// Split out from AppProviders so useEffectiveThemeMode (which reads
// PreferencesContext) can run inside PreferencesProvider - the theme
// actually re-renders when the preference changes, not just on reload.
const ThemedApp = ({ children }: ThemedAppProps) => {
  const mode = useEffectiveThemeMode();

  return (
    <ThemeProvider theme={getTheme(mode)}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style:
                mode === 'dark'
                  ? { background: '#1e1e1e', color: '#ffffff' }
                  : { background: '#ffffff', color: '#000000' },
            }}
          />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <PreferencesProvider>
        <ThemedApp>{children}</ThemedApp>
      </PreferencesProvider>
      {environment.enableDebugTools && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
};

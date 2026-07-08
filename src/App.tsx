import { AppProviders } from './providers/AppProviders';
import { AppRouter } from './routes';
import { ErrorBoundary } from './shared/components/ErrorBoundary/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <AppProviders>
        <AppRouter />
      </AppProviders>
    </ErrorBoundary>
  );
}

export default App;
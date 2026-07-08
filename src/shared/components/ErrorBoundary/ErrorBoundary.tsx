import { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Alert } from '@mui/material';
import { Refresh } from '@mui/icons-material';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    // The full reload remounts everything anyway, so resetting local state
    // first was never observable - it's discarded the instant the page navigates.
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            p: 4,
            gap: 3,
          }}
        >
          <Alert severity="error" variant="filled" sx={{ width: '100%', maxWidth: 500 }}>
            {this.state.error?.message || 'Something went wrong'}
          </Alert>
          <Typography variant="body1" color="text.secondary" align="center">
            An unexpected error occurred. Please try reloading the page.
          </Typography>
          <Button
            variant="contained"
            startIcon={<Refresh />}
            onClick={this.handleReset}
          >
            Reload Page
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}
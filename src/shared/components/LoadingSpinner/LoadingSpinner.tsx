import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  message?: string;
  size?: number;
}

export const LoadingSpinner = ({
  fullScreen = false,
  message = 'Loading...',
  size = 40,
}: LoadingSpinnerProps) => {
  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
      }}
    >
      <CircularProgress size={size} aria-label={message || 'Loading'} />
      {message && (
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      )}
    </Box>
  );

  if (fullScreen) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          width: '100%',
        }}
      >
        {content}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px',
        width: '100%',
      }}
    >
      {content}
    </Box>
  );
};
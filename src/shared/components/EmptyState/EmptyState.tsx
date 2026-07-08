import { Box, Typography, Button } from '@mui/material';
import { Inbox, Add } from '@mui/icons-material';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState = ({
  title,
  description,
  icon = <Inbox sx={{ fontSize: 64, color: 'text.secondary' }} />,
  actionText,
  onAction,
}: EmptyStateProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        px: 4,
        gap: 2,
      }}
    >
      {icon}
      <Typography variant="h6" color="text.primary">
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" color="text.secondary" align="center">
          {description}
        </Typography>
      )}
      {actionText && onAction && (
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={onAction}
          sx={{ mt: 2 }}
        >
          {actionText}
        </Button>
      )}
    </Box>
  );
};
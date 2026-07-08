import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
  Button,
  Skeleton,
  Alert,
} from '@mui/material';
import { CheckCircle, Error as ErrorIcon, Warning, Info, DoneAll } from '@mui/icons-material';
import { EmptyState } from '@/shared/components';
import { dateFormatter } from '@/shared/utils';
import { useNotifications } from '../../hooks/useNotifications';
import { useMarkNotificationRead, useMarkAllNotificationsRead } from '../../hooks/useNotificationMutations';
import type { AppNotification, NotificationType } from '../../types/notification.types';

const RECENT_NOTIFICATIONS_LIMIT = 10;

const TYPE_ICONS: Record<NotificationType, React.ReactNode> = {
  success: <CheckCircle color="success" fontSize="small" />,
  error: <ErrorIcon color="error" fontSize="small" />,
  warning: <Warning color="warning" fontSize="small" />,
  info: <Info color="info" fontSize="small" />,
};

interface NotificationPanelProps {
  onNavigate: () => void;
}

export const NotificationPanel = ({ onNavigate }: NotificationPanelProps) => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useNotifications({ limit: RECENT_NOTIFICATIONS_LIMIT });
  const markReadMutation = useMarkNotificationRead();
  const markAllReadMutation = useMarkAllNotificationsRead();

  const notifications = data?.data ?? [];
  const hasUnread = notifications.some((notification) => !notification.isRead);

  const handleNotificationClick = (notification: AppNotification) => {
    if (!notification.isRead) {
      markReadMutation.mutate(notification.id);
    }
    if (notification.link) {
      navigate(notification.link);
    }
    onNavigate();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, py: 1.5 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Notifications
        </Typography>
        <Button
          size="small"
          startIcon={<DoneAll fontSize="small" />}
          onClick={() => markAllReadMutation.mutate()}
          disabled={!hasUnread || markAllReadMutation.isPending}
        >
          Mark all read
        </Button>
      </Box>
      <Divider />

      {isLoading ? (
        <Box sx={{ p: 2 }}>
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} variant="text" height={48} />
          ))}
        </Box>
      ) : error ? (
        <Box sx={{ p: 2 }}>
          <Alert severity="error">Failed to load notifications.</Alert>
        </Box>
      ) : notifications.length === 0 ? (
        <EmptyState title="No notifications" description="You're all caught up." />
      ) : (
        <List disablePadding role="list" aria-label="Recent notifications" sx={{ maxHeight: 380, overflowY: 'auto' }}>
          {notifications.map((notification) => (
            <ListItemButton
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              sx={{
                alignItems: 'flex-start',
                bgcolor: notification.isRead ? 'transparent' : 'action.hover',
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, mt: 0.5 }}>{TYPE_ICONS[notification.type]}</ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body2" sx={{ fontWeight: notification.isRead ? 400 : 600 }}>
                    {notification.title}
                  </Typography>
                }
                secondary={
                  <>
                    <Typography variant="body2" color="text.secondary" component="span" sx={{ display: 'block' }}>
                      {notification.message}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {dateFormatter.timeAgo(notification.createdAt)}
                    </Typography>
                  </>
                }
              />
            </ListItemButton>
          ))}
        </List>
      )}
    </Box>
  );
};

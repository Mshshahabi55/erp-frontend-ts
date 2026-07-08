import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Chip, IconButton } from '@mui/material';
import { DoneAll, CheckCircle, Error as ErrorIcon, Warning, Info, Delete, Visibility } from '@mui/icons-material';
import { DataTable, Column } from '@/shared/components';
import { dateFormatter } from '@/shared/utils';
import { useNotifications } from '../hooks/useNotifications';
import { useMarkNotificationRead, useMarkAllNotificationsRead, useDeleteNotification } from '../hooks/useNotificationMutations';
import type { AppNotification, NotificationType } from '../types/notification.types';

const TYPE_ICONS: Record<NotificationType, React.ReactNode> = {
  success: <CheckCircle color="success" fontSize="small" />,
  error: <ErrorIcon color="error" fontSize="small" />,
  warning: <Warning color="warning" fontSize="small" />,
  info: <Info color="info" fontSize="small" />,
};

export const NotificationsPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const { data: response, isLoading, error, refetch } = useNotifications({
    page: page + 1,
    limit: pageSize,
  });
  const markReadMutation = useMarkNotificationRead();
  const markAllReadMutation = useMarkAllNotificationsRead();
  const deleteMutation = useDeleteNotification();

  const notifications = response?.data ?? [];
  const totalCount = response?.total ?? 0;
  const hasUnread = notifications.some((notification) => !notification.isRead);

  const handleView = (notification: AppNotification) => {
    if (!notification.isRead) {
      markReadMutation.mutate(notification.id);
    }
    if (notification.link) {
      navigate(notification.link);
    }
  };

  const columns: Column<AppNotification>[] = [
    {
      key: 'type',
      label: 'Type',
      render: (value: NotificationType) => TYPE_ICONS[value],
    },
    {
      key: 'title',
      label: 'Title',
      render: (value: string, row) => (
        <Typography sx={{ fontWeight: row.isRead ? 400 : 600 }}>{value}</Typography>
      ),
    },
    { key: 'message', label: 'Message' },
    { key: 'category', label: 'Category' },
    {
      key: 'createdAt',
      label: 'Received',
      render: (value: string) => dateFormatter.timeAgo(value),
    },
    {
      key: 'isRead',
      label: 'Status',
      render: (value: boolean) => (
        <Chip label={value ? 'Read' : 'Unread'} color={value ? 'default' : 'primary'} size="small" />
      ),
    },
    {
      key: 'id',
      label: 'Actions',
      align: 'right',
      render: (_, row) => (
        <>
          {row.link && (
            <IconButton size="small" onClick={() => handleView(row)} title="Open" aria-label={`Open ${row.title}`}>
              <Visibility />
            </IconButton>
          )}
          <IconButton
            size="small"
            color="error"
            onClick={() => deleteMutation.mutate(row.id)}
            disabled={deleteMutation.isPending}
            title="Delete"
            aria-label={`Delete ${row.title}`}
          >
            <Delete />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          Notifications
        </Typography>
        <Button
          startIcon={<DoneAll />}
          onClick={() => markAllReadMutation.mutate()}
          disabled={!hasUnread || markAllReadMutation.isPending}
        >
          Mark all read
        </Button>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Every alert the system has sent you, low-stock warnings to new orders.
      </Typography>

      <DataTable
        columns={columns}
        data={notifications}
        loading={isLoading}
        error={error}
        totalCount={totalCount}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onRetry={refetch}
        emptyMessage="No notifications yet."
      />
    </Box>
  );
};

export default NotificationsPage;

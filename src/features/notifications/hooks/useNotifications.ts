import { useQuery } from '@tanstack/react-query';
import { notificationService } from '../services/notificationService';
import type { NotificationQueryParams } from '../types/notification.types';

// No real backend push exists in this app, so a short poll is the pragmatic
// way to make the bell feel reasonably live without over-building websockets
// for a mock API.
const NOTIFICATIONS_POLL_INTERVAL = 30 * 1000;

export const notificationKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationKeys.all, 'list'] as const,
  list: (params?: NotificationQueryParams) => [...notificationKeys.lists(), params] as const,
  unreadCount: () => [...notificationKeys.all, 'unreadCount'] as const,
};

export const useNotifications = (params?: NotificationQueryParams) => {
  return useQuery({
    queryKey: notificationKeys.list(params),
    queryFn: () => notificationService.getAll(params),
    refetchInterval: NOTIFICATIONS_POLL_INTERVAL,
  });
};

export const useUnreadNotificationCount = () => {
  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: () => notificationService.getUnreadCount(),
    refetchInterval: NOTIFICATIONS_POLL_INTERVAL,
  });
};

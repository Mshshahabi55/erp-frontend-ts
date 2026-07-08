import { createJsonServerResource } from '@/shared/api';
import type { WithRawId } from '@/shared/types';
import { AppNotification, NotificationQueryParams } from '../types/notification.types';

export type { AppNotification, NotificationQueryParams };

type RawNotification = WithRawId<AppNotification>;

const normalizeNotification = (raw: RawNotification): AppNotification => ({
  ...raw,
  id: String(raw.id),
});

const notificationResource = createJsonServerResource<
  AppNotification,
  RawNotification,
  never,
  Partial<AppNotification>,
  NotificationQueryParams
>({
  resourcePath: '/notifications',
  normalize: normalizeNotification,
  buildFilters: (params) => {
    const filters: Record<string, unknown> = {};

    if (params?.isRead !== undefined) {
      filters.isRead = params.isRead;
    }

    // Newest first by default - notifications are inherently time-ordered.
    const sortBy = params?.sortBy ?? 'createdAt';
    const sortDirection = params?.sortDirection ?? 'desc';
    filters._sort = sortDirection === 'desc' ? `-${sortBy}` : sortBy;

    return filters;
  },
});

export const notificationService = {
  ...notificationResource,

  markAsRead: (id: string) => notificationResource.update(id, { isRead: true }),

  /** json-server has no bulk-update endpoint, so each unread notification is PATCHed individually. */
  async markAllAsRead(): Promise<void> {
    const { data: unread } = await notificationResource.getAll({ isRead: false, limit: 200 });
    await Promise.all(unread.map((notification) => notificationResource.update(notification.id, { isRead: true })));
  },

  async getUnreadCount(): Promise<number> {
    // The paginated response's `total` field already reflects the full
    // filtered count server-side - no need for a separate counting endpoint.
    const { total } = await notificationResource.getAll({ isRead: false, limit: 1 });
    return total;
  },
};

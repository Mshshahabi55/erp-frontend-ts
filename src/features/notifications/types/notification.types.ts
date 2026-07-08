export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export type NotificationCategory = 'low_stock' | 'new_order' | 'system' | 'general';

export interface AppNotification {
  id: string;
  type: NotificationType;
  category: NotificationCategory;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  /** Route to navigate to when the notification is clicked, e.g. "/orders/12". */
  link?: string;
}

export type NotificationSortField = 'createdAt';

export interface NotificationQueryParams {
  page?: number;
  limit?: number;
  isRead?: boolean;
  sortBy?: NotificationSortField;
  sortDirection?: 'asc' | 'desc';
}

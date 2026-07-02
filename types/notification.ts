export type AppNotification = {
  id: string;
  user_id: string;
  title: string;
  body?: string;
  href?: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
};

export type NotificationsResponse = {
  notifications: AppNotification[];
  unread_count: number;
};

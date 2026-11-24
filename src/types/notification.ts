export const NOTIFICATION_TYPES = {
  EXPIRING_BATCHES: "EXPIRING_BATCHES",
  EXPIRED_BATCHES: "EXPIRED_BATCHES",
  LOW_STOCK: "LOW_STOCK",
  OVERDUE_PAYABLES: "OVERDUE_PAYABLES",
  OVERDUE_RECEIVABLES: "OVERDUE_RECEIVABLES",
  LICENSE_EXPIRING: "LICENSE_EXPIRING",
} as const;

export type NotificationType = (typeof NOTIFICATION_TYPES)[keyof typeof NOTIFICATION_TYPES];

export type NotificationSeverity = "INFO" | "WARNING" | "CRITICAL";

/** Extra figures some notification types carry (days window, money amount). */
export interface NotificationData {
  days?: number;
  amount?: number;
}

export interface AppNotification {
  uuid: string;
  type: NotificationType;
  severity: NotificationSeverity;
  count: number;
  data: NotificationData | null;
  link: string | null;
  createdAt: string;
  updatedAt: string;
  isRead: boolean;
}

export interface NotificationList {
  items: AppNotification[];
  unreadCount: number;
}

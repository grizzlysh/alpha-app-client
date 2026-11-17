import { AlertTriangle, CalendarClock, FileWarning, PackageMinus, Receipt, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { Translations } from "@/configs/i18n";
import { formatCurrency } from "@/components/sales/salesUtils";
import type { AppNotification, NotificationSeverity, NotificationType } from "@/types/notification";

const MESSAGE_KEY: Record<NotificationType, keyof Translations> = {
  EXPIRING_BATCHES: "notificationExpiringBatches",
  EXPIRED_BATCHES: "notificationExpiredBatches",
  LOW_STOCK: "notificationLowStock",
  OVERDUE_PAYABLES: "notificationOverduePayables",
  OVERDUE_RECEIVABLES: "notificationOverdueReceivables",
  LICENSE_EXPIRING: "notificationLicenseExpiring",
};

export const NOTIFICATION_ICON: Record<NotificationType, LucideIcon> = {
  EXPIRING_BATCHES: CalendarClock,
  EXPIRED_BATCHES: AlertTriangle,
  LOW_STOCK: PackageMinus,
  OVERDUE_PAYABLES: Receipt,
  OVERDUE_RECEIVABLES: Wallet,
  LICENSE_EXPIRING: FileWarning,
};

export const SEVERITY_CLASS: Record<NotificationSeverity, string> = {
  INFO: "bg-primary/10 text-primary",
  WARNING: "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400",
  CRITICAL: "bg-destructive/10 text-destructive",
};

/** The text is built here (not on the server) so it follows the UI language. */
export function notificationMessage(n: AppNotification, t: Translations): string {
  return String(t[MESSAGE_KEY[n.type]])
    .replace("{n}", String(n.count))
    .replace("{days}", String(n.data?.days ?? ""))
    .replace("{amount}", formatCurrency(n.data?.amount ?? 0));
}

export function formatNotificationTime(value: string, language: string): string {
  return new Date(value).toLocaleString(language === "id" ? "id-ID" : "en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

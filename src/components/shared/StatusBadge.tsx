import type { JSX } from "react";
import { cn } from "@/utils/cn";

export interface StatusBadgeProps {
  status: string;
  label: string;
  className?: string;
}

const STATUS_CLASS_MAP: Record<string, string> = {
  ACTIVE:    "bg-success/15 text-success",
  INACTIVE:  "bg-muted text-muted-foreground",
  DELETED:   "bg-destructive/15 text-destructive",
  ON_PROCESS: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  SENT:       "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  COMPLETED:  "bg-success/15 text-success",
  CANCELLED:  "bg-muted text-muted-foreground",
  REJECTED:   "bg-destructive/15 text-destructive",
  PAID:      "bg-success/15 text-success",
  PARTIAL:   "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  UNPAID:    "bg-destructive/15 text-destructive",
  REFUNDED:  "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300",
  PENDING:   "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
};

const DEFAULT_STATUS_CLASS = "bg-muted text-muted-foreground";

export function StatusBadge({ status, label, className }: StatusBadgeProps): JSX.Element {
  const statusClass = STATUS_CLASS_MAP[status.toUpperCase()] ?? DEFAULT_STATUS_CLASS;
  return (
    <span
      className={cn(
        "inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold",
        statusClass,
        className
      )}
    >
      {label}
    </span>
  );
}

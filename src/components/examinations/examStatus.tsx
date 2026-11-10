import type { JSX } from "react";
import { cn } from "@/utils/cn";
import type { Translations } from "@/configs/i18n";
import type { VisitStatus } from "@/types/examination";

export const formatQueueNumber = (n: number | null): string => (n == null ? "—" : String(n).padStart(2, "0"));

export function examStatusLabel(status: VisitStatus, t: Translations): string {
  return {
    WAITING: t.examStatusWaiting,
    IN_PROGRESS: t.examStatusInProgress,
    COMPLETED: t.examStatusCompleted,
    CANCELLED: t.examStatusCancelled,
  }[status];
}

const STYLE: Record<VisitStatus, string> = {
  WAITING: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  IN_PROGRESS: "bg-primary/10 text-primary",
  COMPLETED: "bg-success/10 text-success",
  CANCELLED: "bg-muted text-muted-foreground",
};

export function ExamStatusBadge({ status, t }: { status: VisitStatus; t: Translations }): JSX.Element {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold", STYLE[status])}>
      {examStatusLabel(status, t)}
    </span>
  );
}

import type { JSX } from "react";

import { cn } from "@/utils/cn";
import type { Translations } from "@/configs/i18n";
import type { JobRunStatus } from "@/types/job";

const STATUS_STYLE: Record<JobRunStatus, string> = {
  RUNNING: "bg-primary/10 text-primary",
  SUCCESS: "bg-success/10 text-success",
  FAILED: "bg-destructive/10 text-destructive",
  SKIPPED: "bg-muted text-muted-foreground",
};

export function JobStatusBadge({ status, t }: { status: JobRunStatus; t: Translations }): JSX.Element {
  const label = {
    RUNNING: t.jobsStatusRunning,
    SUCCESS: t.jobsStatusSuccess,
    FAILED: t.jobsStatusFailed,
    SKIPPED: t.jobsStatusSkipped,
  }[status];
  return (
    <span className={cn("inline-flex whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold", STATUS_STYLE[status])}>
      {label}
    </span>
  );
}

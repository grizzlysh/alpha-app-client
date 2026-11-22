import type { JSX } from "react";
import { CalendarClock, Loader2, Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Translations } from "@/configs/i18n";
import type { BackgroundJob } from "@/types/job";
import { JobStatusBadge } from "./JobStatusBadge";
import { describeSchedule, formatRunTime, jobDescription, jobLabel } from "./jobUtils";

interface JobCardProps {
  job: BackgroundJob;
  t: Translations;
  language: string;
  isRunning: boolean;
  onRun: () => void;
}

/** One job: what it does, when it runs, how its last run went, and "run now". */
export function JobCard({ job, t, language, isRunning, onRun }: JobCardProps): JSX.Element {
  const last = job.lastRun;

  return (
    <Card className="flex flex-col gap-3 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-foreground">{jobLabel(job.name, t)}</p>
          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarClock className="h-3.5 w-3.5 shrink-0" aria-hidden />
            {describeSchedule(job.schedule, t)}
            <span className="hidden font-mono text-[11px] opacity-70 sm:inline">· {job.name}</span>
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-8 shrink-0 gap-1.5 rounded-xl text-xs"
          disabled={isRunning}
          onClick={onRun}
        >
          {isRunning ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
          {t.jobsRunNow}
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">{jobDescription(job.name, job.description, t)}</p>

      <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl bg-muted/30 px-3 py-2 text-xs">
        <span className="text-muted-foreground">{t.jobsLastRun}</span>
        {last ? (
          <>
            <JobStatusBadge status={last.status} t={t} />
            <span className="text-foreground">{formatRunTime(last.startedAt, language)}</span>
            {last.status === "SUCCESS" && (
              <span className="text-muted-foreground">
                {t.jobsColAffected}: <span className="font-medium tabular-nums text-foreground">{last.affected}</span>
              </span>
            )}
            {last.error && <span className="w-full truncate text-destructive" title={last.error}>{last.error}</span>}
          </>
        ) : (
          <span className="text-muted-foreground/70">{t.jobsNeverRun}</span>
        )}
      </div>
    </Card>
  );
}

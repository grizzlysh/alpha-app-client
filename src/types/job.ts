export type JobRunStatus = "RUNNING" | "SUCCESS" | "FAILED" | "SKIPPED";
export type JobTrigger = "SCHEDULE" | "MANUAL";

export interface JobRun {
  uuid: string;
  name: string;
  status: JobRunStatus;
  trigger: JobTrigger;
  startedAt: string;
  finishedAt: string | null;
  affected: number;
  details: Record<string, unknown> | null;
  error: string | null;
  triggeredBy: { uuid: string; name: string } | null;
}

export interface BackgroundJob {
  name: string;
  description: string;
  /** Cron expression in the system timezone. */
  schedule: string;
  lastRun: JobRun | null;
}

/** What POST /jobs/:name/run returns once the run has finished. */
export interface JobRunOutcome {
  uuid: string;
  name: string;
  status: JobRunStatus;
  affected: number;
  error: string | null;
}

export interface JobRunListParams {
  name?: string;
  limit?: number;
}

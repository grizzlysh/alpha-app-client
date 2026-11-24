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

export interface JobParam {
  key: string;
  value: number;
  default: number;
  min: number;
  max: number;
}

export interface BackgroundJob {
  name: string;
  description: string;
  enabled: boolean;
  /** HH:mm in the system timezone. */
  time: string;
  defaultTime: string;
  timezone: string;
  /** Global numbers, editable on the jobs page. */
  params: JobParam[];
  /** Business parameters each pharmacy sets for itself. */
  pharmacyParams: string[];
  lastRun: JobRun | null;
}

export interface UpdateJobSettingsPayload {
  enabled: boolean;
  time: string;
  params: Record<string, number>;
}

/** What POST /jobs/:name/run returns once the run has finished. */
export interface JobRunOutcome {
  /** Null when nothing was logged (a scheduled run another server took). */
  uuid: string | null;
  name: string;
  status: JobRunStatus;
  affected: number;
  error: string | null;
}

export interface JobRunListParams {
  name?: string;
  limit?: number;
}

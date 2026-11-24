import type { Translations } from "@/configs/i18n";
import type { JobRun } from "@/types/job";

/** Display name and description per job; the server's English text is the fallback. */
const JOB_TEXT: Record<string, { name: keyof Translations; desc: keyof Translations }> = {
  "cancel-held-sales": { name: "jobNameCancelHeldSales", desc: "jobDescCancelHeldSales" },
  "expire-prescriptions": { name: "jobNameExpirePrescriptions", desc: "jobDescExpirePrescriptions" },
  "purge-expired": { name: "jobNamePurgeExpired", desc: "jobDescPurgeExpired" },
  "daily-alerts": { name: "jobNameDailyAlerts", desc: "jobDescDailyAlerts" },
};

export function jobLabel(name: string, t: Translations): string {
  const key = JOB_TEXT[name]?.name;
  return key ? String(t[key]) : name;
}

export function jobDescription(name: string, fallback: string, t: Translations): string {
  const key = JOB_TEXT[name]?.desc;
  return key ? String(t[key]) : fallback;
}

const PARAM_LABEL: Record<string, keyof Translations> = {
  notificationRetentionDays: "jobsParamNotificationRetention",
  jobRunRetentionDays: "jobsParamJobRunRetention",
};

export function jobParamLabel(key: string, t: Translations): string {
  const label = PARAM_LABEL[key];
  return label ? String(t[label]) : key;
}

export function formatRunTime(iso: string, language: string): string {
  return new Date(iso).toLocaleString(language === "id" ? "id-ID" : "en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDuration(run: Pick<JobRun, "startedAt" | "finishedAt">): string {
  if (!run.finishedAt) return "—";
  const ms = new Date(run.finishedAt).getTime() - new Date(run.startedAt).getTime();
  return ms < 1000 ? `${ms} ms` : `${(ms / 1000).toFixed(1)} s`;
}

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

/** "M H * * *" reads as "Daily at HH:MM"; anything else is shown as the raw cron expression. */
export function describeSchedule(cron: string, t: Translations): string {
  const daily = /^(\d{1,2}) (\d{1,2}) \* \* \*$/.exec(cron.trim());
  if (!daily) return cron;
  const time = `${daily[2].padStart(2, "0")}:${daily[1].padStart(2, "0")}`;
  return t.jobsDailyAt.replace("{time}", time);
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

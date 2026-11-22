import type { JSX } from "react";
import { History } from "lucide-react";

import { Combobox } from "@/components/ui/combobox";
import { TableLoadingSkeleton } from "@/components/shared/TableLoadingSkeleton";
import type { Translations } from "@/configs/i18n";
import type { BackgroundJob, JobRun } from "@/types/job";
import { JobStatusBadge } from "./JobStatusBadge";
import { formatDuration, formatRunTime, jobLabel } from "./jobUtils";

interface JobRunHistoryProps {
  runs: JobRun[];
  jobs: BackgroundJob[];
  isLoading: boolean;
  filter: string;
  onFilterChange: (name: string) => void;
  t: Translations;
  language: string;
}

const TH = "whitespace-nowrap bg-muted px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground";

/** The latest runs of every job (or one), newest first. */
export function JobRunHistory({ runs, jobs, isLoading, filter, onFilterChange, t, language }: JobRunHistoryProps): JSX.Element {
  const options = [
    { value: "", label: t.jobsAllJobs },
    ...jobs.map((j) => ({ value: j.name, label: jobLabel(j.name, t) })),
  ];

  const triggerLabel = (run: JobRun): string =>
    run.trigger === "SCHEDULE" ? t.jobsTriggerSchedule : t.jobsTriggerManual.replace("{name}", run.triggeredBy?.name ?? "—");

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3 sm:px-5">
        <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <History className="h-4 w-4 text-muted-foreground" aria-hidden />
          {t.jobsHistory}
        </p>
        <Combobox
          value={filter}
          onValueChange={onFilterChange}
          options={options}
          placeholder={t.jobsAllJobs}
          className="h-9 w-full rounded-xl text-sm sm:w-[14rem]"
        />
      </div>

      {isLoading ? (
        <TableLoadingSkeleton />
      ) : runs.length === 0 ? (
        <p className="px-5 py-10 text-center text-sm text-muted-foreground">{t.jobsNoRuns}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className={TH}>{t.jobsColJob}</th>
                <th className={TH}>{t.jobsColStatus}</th>
                <th className={TH}>{t.jobsColStarted}</th>
                <th className={TH}>{t.jobsColDuration}</th>
                <th className={`${TH} text-right`}>{t.jobsColAffected}</th>
                <th className={TH}>{t.jobsColTrigger}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {runs.map((run) => (
                <tr key={run.uuid} className="align-top">
                  <td className="min-w-[11rem] px-4 py-3">
                    <p className="font-medium text-foreground">{jobLabel(run.name, t)}</p>
                    {run.error && (
                      <p className="mt-0.5 max-w-[22rem] truncate text-xs text-destructive" title={run.error}>
                        {run.error}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <JobStatusBadge status={run.status} t={t} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-foreground">{formatRunTime(run.startedAt, language)}</td>
                  <td className="whitespace-nowrap px-4 py-3 tabular-nums text-muted-foreground">{formatDuration(run)}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-foreground">{run.affected}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{triggerLabel(run)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

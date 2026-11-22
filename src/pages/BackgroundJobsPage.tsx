import type { JSX } from "react";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Card } from "@/components/ui/card";
import { JobCard } from "@/components/background-jobs/JobCard";
import { JobRunHistory } from "@/components/background-jobs/JobRunHistory";
import { JobRunConfirmModal } from "@/components/background-jobs/JobRunConfirmModal";
import { JobSettingsModal } from "@/components/background-jobs/JobSettingsModal";
import { jobLabel } from "@/components/background-jobs/jobUtils";
import { useLanguage } from "@/hooks/useLanguage";
import { useScrollAwareTitle } from "@/hooks/useScrollAwareTitle";
import { getJobRuns, getJobs, runJob } from "@/service/jobService";
import { getApiErrorMessage } from "@/utils/apiError";
import type { RootState } from "@/store";
import type { BackgroundJob } from "@/types/job";

const HISTORY_LIMIT = 50;

/** Platform admin: the scheduled jobs, their last runs, and "run now". */
export default function BackgroundJobsPage(): JSX.Element {
  const { t, language } = useLanguage();
  const pageTitleRef = useScrollAwareTitle();
  const queryClient = useQueryClient();
  const isPlatformAdmin = useSelector((s: RootState) => s.auth.user?.platformRole === "PLATFORM_ADMIN");
  const [filter, setFilter] = useState("");
  const [confirming, setConfirming] = useState<BackgroundJob | null>(null);
  const [editing, setEditing] = useState<BackgroundJob | null>(null);

  const jobsQuery = useQuery({
    queryKey: ["background-jobs"],
    queryFn: async () => (await getJobs()).data ?? [],
    enabled: isPlatformAdmin,
  });
  const runsQuery = useQuery({
    queryKey: ["background-job-runs", filter],
    queryFn: async () => (await getJobRuns({ name: filter || undefined, limit: HISTORY_LIMIT })).data ?? [],
    enabled: isPlatformAdmin,
  });

  const runMutation = useMutation({
    mutationFn: (name: string) => runJob(name),
    onSuccess: (res) => {
      const outcome = res.data;
      if (outcome) {
        const name = jobLabel(outcome.name, t);
        if (outcome.status === "SUCCESS") {
          toast.success(t.jobsRunDone.replace("{name}", name).replace("{n}", String(outcome.affected)));
        } else if (outcome.status === "SKIPPED") {
          toast.warning(t.jobsRunSkippedMsg.replace("{name}", name));
        } else {
          toast.error(t.jobsRunFailedMsg.replace("{name}", name).replace("{error}", outcome.error ?? "—"));
        }
      }
      setConfirming(null);
    },
    onError: (err) => toast.error(getApiErrorMessage(err, language, t.unexpectedError)),
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ["background-jobs"] });
      void queryClient.invalidateQueries({ queryKey: ["background-job-runs"] });
    },
  });

  // Other platform roles may not run jobs (the API refuses them too).
  if (!isPlatformAdmin) return <Navigate to="/" replace />;

  const jobs = jobsQuery.data ?? [];
  const runningName = runMutation.isPending ? runMutation.variables : null;

  return (
    <div className="space-y-6">
      <div>
        <h2 ref={pageTitleRef} className="text-2xl font-bold tracking-tight text-foreground">
          {t.navBackgroundJobs}
        </h2>
        <p className="mt-0.5 text-sm text-muted-foreground">{t.jobsSubtitle}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {jobsQuery.isLoading
          ? [0, 1, 2, 3].map((i) => <div key={i} className="h-40 animate-pulse rounded-2xl bg-muted/50" />)
          : jobs.map((job) => (
              <JobCard
                key={job.name}
                job={job}
                t={t}
                language={language}
                isRunning={runningName === job.name}
                onRun={() => setConfirming(job)}
                onSettings={() => setEditing(job)}
              />
            ))}
      </div>

      <Card className="overflow-hidden">
        <JobRunHistory
          runs={runsQuery.data ?? []}
          jobs={jobs}
          isLoading={runsQuery.isLoading}
          filter={filter}
          onFilterChange={setFilter}
          t={t}
          language={language}
        />
      </Card>

      {editing && <JobSettingsModal job={editing} onClose={() => setEditing(null)} />}

      {confirming && (
        <JobRunConfirmModal
          job={confirming}
          isPending={runMutation.isPending}
          t={t}
          onConfirm={() => runMutation.mutate(confirming.name)}
          onClose={() => setConfirming(null)}
        />
      )}
    </div>
  );
}

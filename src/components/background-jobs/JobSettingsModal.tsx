import type { JSX } from "react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Store } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/hooks/useLanguage";
import { updateJobSettings } from "@/service/jobService";
import { getApiErrorMessage } from "@/utils/apiError";
import { cn } from "@/utils/cn";
import type { BackgroundJob } from "@/types/job";
import { jobLabel, jobParamLabel } from "./jobUtils";

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

interface JobSettingsModalProps {
  job: BackgroundJob;
  onClose: () => void;
}

/** On/off, time of day and the job's own numbers (global). Per-pharmacy numbers are only listed. */
export function JobSettingsModal({ job, onClose }: JobSettingsModalProps): JSX.Element {
  const { t, language } = useLanguage();
  const queryClient = useQueryClient();
  const [enabled, setEnabled] = useState(job.enabled);
  const [time, setTime] = useState(job.time);
  const [params, setParams] = useState<Record<string, string>>(
    Object.fromEntries(job.params.map((p) => [p.key, String(p.value)]))
  );

  const timeValid = TIME_PATTERN.test(time);
  const paramValid = (key: string): boolean => {
    const def = job.params.find((p) => p.key === key)!;
    const v = Number(params[key]);
    return params[key] !== "" && Number.isInteger(v) && v >= def.min && v <= def.max;
  };
  const valid = timeValid && job.params.every((p) => paramValid(p.key));

  const mutation = useMutation({
    mutationFn: () =>
      updateJobSettings(job.name, {
        enabled,
        time,
        params: Object.fromEntries(job.params.map((p) => [p.key, Number(params[p.key])])),
      }),
    onSuccess: () => {
      toast.success(t.jobsSettingsSaved);
      void queryClient.invalidateQueries({ queryKey: ["background-jobs"] });
      onClose();
    },
    onError: (err) => toast.error(getApiErrorMessage(err, language, t.unexpectedError)),
  });

  return (
    <Dialog open onOpenChange={(open) => !open && !mutation.isPending && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t.jobsSettingsTitle.replace("{name}", jobLabel(job.name, t))}</DialogTitle>
        </DialogHeader>

        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            if (valid) mutation.mutate();
          }}
        >
          {/* On / off */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-foreground">{t.jobsEnabled}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{t.jobsEnabledHint}</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={enabled}
              aria-label={t.jobsEnabled}
              onClick={() => setEnabled((v) => !v)}
              className={cn(
                "relative h-6 w-11 shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                enabled ? "bg-primary" : "bg-muted-foreground/30"
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 h-5 w-5 rounded-full bg-background shadow transition-all",
                  enabled ? "left-[22px]" : "left-0.5"
                )}
              />
            </button>
          </div>

          {/* Time */}
          <div className="space-y-1.5">
            <Label htmlFor="job-time">{t.jobsTime}</Label>
            <Input
              id="job-time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className={cn("w-36 rounded-xl", !timeValid && "border-destructive")}
            />
            <p className="text-xs text-muted-foreground">
              {t.jobsTimeHint.replace("{tz}", job.timezone).replace("{time}", job.defaultTime)}
            </p>
          </div>

          {/* Job's own numbers */}
          {job.params.map((p) => (
            <div key={p.key} className="space-y-1.5">
              <Label htmlFor={`job-param-${p.key}`}>{jobParamLabel(p.key, t)}</Label>
              <Input
                id={`job-param-${p.key}`}
                type="number"
                inputMode="numeric"
                min={p.min}
                max={p.max}
                value={params[p.key]}
                onChange={(e) => setParams((prev) => ({ ...prev, [p.key]: e.target.value }))}
                className={cn("w-36 rounded-xl", !paramValid(p.key) && "border-destructive")}
              />
              <p className="text-xs text-muted-foreground">
                {t.jobsDefaultValue
                  .replace("{value}", String(p.default))
                  .replace("{min}", String(p.min))
                  .replace("{max}", String(p.max))}
              </p>
            </div>
          ))}

          {/* Per-pharmacy numbers: read-only pointer */}
          {job.pharmacyParams.length > 0 && (
            <div className="rounded-xl border border-border bg-muted/30 px-4 py-3">
              <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Store className="h-4 w-4 text-muted-foreground" aria-hidden />
                {t.jobsPharmacyParams}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{t.jobsPharmacyParamsHint}</p>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {job.pharmacyParams.map((key) => (
                  <li key={key} className="rounded-md bg-card px-2 py-0.5 font-mono text-[11px] text-foreground ring-1 ring-border">
                    {key}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" className="rounded-xl" disabled={mutation.isPending} onClick={onClose}>
              {t.cancel}
            </Button>
            <Button type="submit" className="gap-2 rounded-xl" disabled={!valid || mutation.isPending}>
              {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {t.save}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

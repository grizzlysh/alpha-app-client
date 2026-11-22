import type { JSX } from "react";
import { Loader2, Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Translations } from "@/configs/i18n";
import type { BackgroundJob } from "@/types/job";
import { jobDescription, jobLabel } from "./jobUtils";

interface JobRunConfirmModalProps {
  job: BackgroundJob;
  isPending: boolean;
  t: Translations;
  onConfirm: () => void;
  onClose: () => void;
}

export function JobRunConfirmModal({ job, isPending, t, onConfirm, onClose }: JobRunConfirmModalProps): JSX.Element {
  return (
    <Dialog open onOpenChange={(open) => !open && !isPending && onClose()}>
      <DialogContent className="max-w-md" onInteractOutside={(e) => isPending && e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{t.jobsConfirmTitle.replace("{name}", jobLabel(job.name, t))}</DialogTitle>
          <DialogDescription className="mt-1">{t.jobsConfirmDesc}</DialogDescription>
        </DialogHeader>
        <p className="rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
          {jobDescription(job.name, job.description, t)}
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" className="rounded-xl" disabled={isPending} onClick={onClose}>
            {t.cancel}
          </Button>
          <Button className="gap-2 rounded-xl" disabled={isPending} onClick={onConfirm}>
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
            {t.jobsRunNow}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

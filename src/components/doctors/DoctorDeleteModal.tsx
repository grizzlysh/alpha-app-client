import type { JSX } from "react";
import { AlertTriangle, Loader2, Stethoscope } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useLanguage } from "@/hooks/useLanguage";
import { useDeleteMutation } from "@/hooks/useDeleteMutation";
import type { Doctor } from "@/types/doctor";
import { deleteDoctor } from "@/service/doctorService";

export interface DoctorDeleteModalProps {
  doctor: Doctor;
  onClose: () => void;
  onSuccess: () => void;
}

export function DoctorDeleteModal({
  doctor,
  onClose,
  onSuccess,
}: DoctorDeleteModalProps): JSX.Element {
  const { t } = useLanguage();

  const { mutate, isPending } = useDeleteMutation({
    mutationFn: () => deleteDoctor(doctor.uuid),
    queryKey: ["doctors"],
    onSuccess,
  });

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !isPending) onClose();
      }}
    >
      <DialogContent
        className="max-w-md"
        onInteractOutside={(e) => {
          if (isPending) e.preventDefault();
        }}
      >
        <DialogHeader>
          <div className="flex items-start gap-4">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-destructive/10">
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </div>
            <div className="min-w-0 flex-1">
              <DialogTitle>{t.doctorDeleteConfirmTitle}</DialogTitle>
              <DialogDescription className="mt-1">
                {t.doctorDeleteConfirmDesc}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="rounded-xl border border-border bg-muted/30 px-4 py-3">
          <div className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4 shrink-0 text-muted-foreground" />
            <p className="name-case truncate font-medium text-foreground">{doctor.name}</p>
          </div>
          {doctor.licenseNumber && (
            <p className="mt-0.5 text-xs text-muted-foreground">{doctor.licenseNumber}</p>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isPending}
            className="rounded-xl"
          >
            {t.cancel}
          </Button>
          <Button
            variant="destructive"
            onClick={mutate}
            disabled={isPending}
            className="min-w-[6rem] rounded-xl"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t.doctorDeleting}
              </>
            ) : (
              t.deleteConfirm
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

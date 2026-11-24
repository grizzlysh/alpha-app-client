import type { JSX } from "react";
import { AlertTriangle, Loader2, Phone } from "lucide-react";

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
import type { Patient } from "@/types/patient";
import { deletePatient } from "@/service/patientService";

export interface PatientDeleteModalProps {
  patient: Patient;
  onClose: () => void;
  onSuccess: () => void;
}

export function PatientDeleteModal({
  patient,
  onClose,
  onSuccess,
}: PatientDeleteModalProps): JSX.Element {
  const { t } = useLanguage();

  const { mutate, isPending } = useDeleteMutation({
    mutationFn: () => deletePatient(patient.uuid),
    queryKey: ["patients"],
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
              <DialogTitle>{t.patientDeleteConfirmTitle}</DialogTitle>
              <DialogDescription className="mt-1">
                {t.patientDeleteConfirmDesc}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="rounded-xl border border-border bg-muted/30 px-4 py-3">
          <p className="truncate font-medium name-case text-foreground">{patient.name}</p>
          {patient.phone && (
            <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Phone className="h-3 w-3 flex-shrink-0" />
              <span>{patient.phone}</span>
            </div>
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
                {t.patientDeleting}
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

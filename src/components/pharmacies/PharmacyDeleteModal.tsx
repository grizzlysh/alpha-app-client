import type { JSX } from "react";
import { Loader2, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLanguage } from "@/hooks/useLanguage";
import { useDeleteMutation } from "@/hooks/useDeleteMutation";
import type { Pharmacy } from "@/types/pharmacy";
import { deletePharmacy } from "@/service/pharmacyService";

export interface PharmacyDeleteModalProps {
  pharmacy: Pharmacy;
  onClose: () => void;
  onSuccess: () => void;
}

export function PharmacyDeleteModal({
  pharmacy,
  onClose,
  onSuccess,
}: PharmacyDeleteModalProps): JSX.Element {
  const { t } = useLanguage();

  const { mutate, isPending } = useDeleteMutation({
    mutationFn: () => deletePharmacy(pharmacy.uuid),
    queryKey: ["pharmacies"],
    onSuccess,
  });

  return (
    <Dialog open onOpenChange={(open) => { if (!open && !isPending) onClose(); }}>
      <DialogContent
        className="max-w-sm p-0"
        onInteractOutside={(e) => { if (isPending) e.preventDefault(); }}
      >
        <DialogHeader className="flex flex-row items-center gap-3 space-y-0 border-b border-border px-6 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-destructive/10">
            <Trash2 className="h-4 w-4 text-destructive" />
          </div>
          <DialogTitle className="text-base">{t.pharmaDeleteConfirmTitle}</DialogTitle>
        </DialogHeader>

        <div className="px-6 py-5">
          <p className="text-sm text-muted-foreground">
            {t.pharmaDeleteConfirmDesc}{" "}
            <span className="font-semibold text-foreground">{pharmacy.name}</span>?
          </p>
        </div>

        <div className="flex justify-end gap-2 border-t border-border px-6 py-4">
          <Button
            type="button"
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
              <><Loader2 className="h-4 w-4 animate-spin" /> {t.pharmaDeleting}</>
            ) : t.deleteConfirm}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

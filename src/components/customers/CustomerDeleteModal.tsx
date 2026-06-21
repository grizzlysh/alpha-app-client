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
import type { Customer } from "@/types/customer";
import { deleteCustomer } from "@/service/customerService";

export interface CustomerDeleteModalProps {
  customer: Customer;
  onClose: () => void;
  onSuccess: () => void;
}

export function CustomerDeleteModal({
  customer,
  onClose,
  onSuccess,
}: CustomerDeleteModalProps): JSX.Element {
  const { t } = useLanguage();

  const { mutate, isPending } = useDeleteMutation({
    mutationFn: () => deleteCustomer(customer.uuid),
    queryKey: ["customers"],
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
              <DialogTitle>{t.customerDeleteConfirmTitle}</DialogTitle>
              <DialogDescription className="mt-1">
                {t.customerDeleteConfirmDesc}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="rounded-xl border border-border bg-muted/30 px-4 py-3">
          <p className="truncate font-medium uppercase text-foreground">{customer.name}</p>
          {customer.phone && (
            <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Phone className="h-3 w-3 flex-shrink-0" />
              <span>{customer.phone}</span>
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
                {t.customerDeleting}
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

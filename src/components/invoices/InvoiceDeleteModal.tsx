import type { JSX } from "react";
import { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useLanguage } from "@/hooks/useLanguage";
import { getApiErrorMessage } from "@/utils/apiError";
import type { Invoice } from "@/types/invoice";
import { deleteInvoice } from "@/service/invoiceService";

export interface InvoiceDeleteModalProps {
  invoice: Invoice;
  onClose: () => void;
  onSuccess: () => void;
}

export function InvoiceDeleteModal({
  invoice,
  onClose,
  onSuccess,
}: InvoiceDeleteModalProps): JSX.Element {
  const queryClient = useQueryClient();
  const { t, language } = useLanguage();

  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  const mutation = useMutation({
    mutationFn: () => deleteInvoice(invoice.uuid),
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ["invoices"] });
        toast.success(t.invoiceDeleteSuccess);
        onSuccessRef.current();
      } else {
        toast.error(res.message[language]);
      }
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, language, t.unexpectedError));
    },
  });

  const isPending = mutation.isPending;

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !isPending) onClose();
      }}
    >
      <DialogContent
        className="max-w-sm p-0"
        onInteractOutside={(e) => {
          if (isPending) e.preventDefault();
        }}
      >
        <DialogHeader className="flex flex-row items-center gap-3 space-y-0 border-b border-border px-6 py-4">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-destructive/10">
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </div>
          <DialogTitle className="text-base">
            {t.invoiceDeleteConfirmTitle}
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-5">
          <DialogDescription className="text-sm text-muted-foreground">
            {t.invoiceDeleteConfirmDesc}
          </DialogDescription>
          <p className="mt-3 rounded-lg bg-muted px-3 py-2 text-sm font-medium text-foreground">
            <span className="uppercase">{invoice.invoiceNumber}</span> · <span className="uppercase">{invoice.distributor.name}</span>
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
            type="button"
            variant="destructive"
            disabled={isPending}
            onClick={() => mutation.mutate()}
            className="min-w-[7rem] rounded-xl"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t.invoiceDeleting}
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

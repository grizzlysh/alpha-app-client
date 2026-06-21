import type { JSX } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLanguage } from "@/hooks/useLanguage";
import { getApiErrorMessage } from "@/utils/apiError";
import type { InvoicePaymentHistory } from "@/types/invoice";
import { deletePaymentHistory } from "@/service/invoicePaymentService";
import { formatCurrency, formatDate } from "./invoiceUtils";

// ── Modal ─────────────────────────────────────────────

export interface InvoicePaymentDeleteModalProps {
  invoiceUuid: string;
  history: InvoicePaymentHistory;
  onClose: () => void;
  onSuccess: () => void;
}

export function InvoicePaymentDeleteModal({
  invoiceUuid,
  history,
  onClose,
  onSuccess,
}: InvoicePaymentDeleteModalProps): JSX.Element {
  const queryClient = useQueryClient();
  const { t, language } = useLanguage();

  const mutation = useMutation({
    mutationFn: () => deletePaymentHistory(invoiceUuid, history.uuid),
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ["invoices"] });
        queryClient.invalidateQueries({ queryKey: ["invoice", invoiceUuid] });
        queryClient.invalidateQueries({
          queryKey: ["invoice-payment", invoiceUuid],
        });
        toast.success(t.invoicePaymentDeleteSuccess);
        onSuccess();
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
            <Trash2 className="h-4 w-4 text-destructive" />
          </div>
          <DialogTitle className="text-base">{t.invoicePaymentDeleteTitle}</DialogTitle>
        </DialogHeader>

        <div className="px-6 py-5 space-y-4">
          <p className="text-sm text-muted-foreground">{t.invoicePaymentDeleteDesc}</p>

          {/* Payment summary */}
          <div className="rounded-xl border border-border bg-muted/40 divide-y divide-border">
            <div className="flex items-center justify-between px-4 py-2.5">
              <span className="text-xs text-muted-foreground">{t.invoicePaymentAmountLabel}</span>
              <span className="text-sm font-semibold text-foreground">
                {formatCurrency(history.amount)}
              </span>
            </div>
            <div className="flex items-center justify-between px-4 py-2.5">
              <span className="text-xs text-muted-foreground">{t.invoicePaymentMethodLabel}</span>
              <span className="text-sm font-medium text-foreground">
                {history.paymentMethod === "CASH"
                  ? t.invoicePaymentMethodCash
                  : history.paymentMethod === "TRANSFER"
                  ? t.invoicePaymentMethodTransfer
                  : t.invoicePaymentMethodCredit}
              </span>
            </div>
            <div className="flex items-center justify-between px-4 py-2.5">
              <span className="text-xs text-muted-foreground">{t.invoicePaymentDateLabel}</span>
              <span className="text-sm font-medium text-foreground">
                {formatDate(history.paymentDate)}
              </span>
            </div>
            {history.description && (
              <div className="flex items-center justify-between px-4 py-2.5">
                <span className="text-xs text-muted-foreground">{t.invoicePaymentDescriptionLabel}</span>
                <span className="text-sm font-medium text-foreground max-w-[60%] text-right">
                  {history.description}
                </span>
              </div>
            )}
          </div>
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
            className="min-w-[9rem] rounded-xl"
            onClick={() => mutation.mutate()}
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

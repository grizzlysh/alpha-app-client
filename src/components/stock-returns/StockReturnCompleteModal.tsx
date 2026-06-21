import type { JSX } from "react";
import { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CheckCircle2, Loader2, AlertTriangle } from "lucide-react";

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
import type { StockReturn } from "@/types/stockReturn";
import { completeStockReturn } from "@/service/stockReturnService";

export interface StockReturnCompleteModalProps {
  stockReturn: StockReturn;
  onClose: () => void;
  onSuccess: (updated: StockReturn) => void;
}

export function StockReturnCompleteModal({
  stockReturn,
  onClose,
  onSuccess,
}: StockReturnCompleteModalProps): JSX.Element {
  const queryClient = useQueryClient();
  const { t, language } = useLanguage();

  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  const mutation = useMutation({
    mutationFn: () => completeStockReturn(stockReturn.uuid),
    onSuccess: (res) => {
      if (res.success && res.data) {
        queryClient.invalidateQueries({ queryKey: ["stock-returns"] });
        toast.success(t.srCompleteSuccess);
        onSuccessRef.current(res.data);
      } else {
        toast.error(res.message[language]);
      }
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, language, t.unexpectedError));
    },
  });

  const isPending = mutation.isPending;
  const missingSignedBy = !stockReturn.signedBy;

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
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-success/10">
            <CheckCircle2 className="h-4 w-4 text-success" />
          </div>
          <DialogTitle className="text-base">{t.srCompleteConfirmTitle}</DialogTitle>
        </DialogHeader>

        <div className="px-6 py-5">
          <DialogDescription className="text-sm text-muted-foreground">
            {t.srCompleteConfirmDesc}
          </DialogDescription>
          <div className="mt-3 rounded-lg bg-muted px-3 py-2 text-sm">
            <p className="font-medium text-foreground">{stockReturn.returnNumber}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              <span className="uppercase">{stockReturn.distributor.name}</span>
            </p>
            {stockReturn.details.length > 0 && (
              <p className="mt-0.5 text-xs text-muted-foreground">
                {stockReturn.details.length}{" "}
                {stockReturn.details.length === 1 ? t.srSingular : t.srPlural}
              </p>
            )}
          </div>

          {missingSignedBy && (
            <div className="mt-3 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2.5">
              <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-destructive" />
              <p className="text-xs text-destructive">
                {t.srCompleteNoSignerWarning}
              </p>
            </div>
          )}
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
            variant="success"
            disabled={isPending || missingSignedBy}
            onClick={() => mutation.mutate()}
            className="min-w-[9rem] gap-2 rounded-xl"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t.srCompleting}
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                {t.srComplete}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

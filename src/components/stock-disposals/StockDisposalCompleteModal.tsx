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
import type { StockDisposal } from "@/types/stockDisposal";
import { completeStockDisposal } from "@/service/stockDisposalService";

export interface StockDisposalCompleteModalProps {
  disposal: StockDisposal;
  onClose: () => void;
  onSuccess: (updated: StockDisposal) => void;
}

export function StockDisposalCompleteModal({
  disposal,
  onClose,
  onSuccess,
}: StockDisposalCompleteModalProps): JSX.Element {
  const queryClient = useQueryClient();
  const { t, language } = useLanguage();

  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  const mutation = useMutation({
    mutationFn: () => completeStockDisposal(disposal.uuid),
    onSuccess: (res) => {
      if (res.success && res.data) {
        queryClient.invalidateQueries({ queryKey: ["stock-disposals"] });
        queryClient.invalidateQueries({ queryKey: ["stock-disposal", disposal.uuid] });
        toast.success(t.sdCompleteSuccess);
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
  const missingSignedBy = !disposal.signedByUser;

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
          <DialogTitle className="text-base">{t.sdCompleteConfirmTitle}</DialogTitle>
        </DialogHeader>

        <div className="px-6 py-5">
          <DialogDescription className="text-sm text-muted-foreground">
            {t.sdCompleteConfirmDesc}
          </DialogDescription>
          <div className="mt-3 rounded-lg bg-muted px-3 py-2 text-sm">
            <p className="font-medium text-foreground">{disposal.disposalNumber}</p>
            {disposal.details.length > 0 && (
              <p className="mt-0.5 text-xs text-muted-foreground">
                {disposal.details.length}{" "}
                {disposal.details.length === 1 ? t.sdSingular : t.sdPlural}
              </p>
            )}
          </div>

          {missingSignedBy && (
            <div className="mt-3 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 dark:border-amber-800/40 dark:bg-amber-900/20">
              <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600 dark:text-amber-400" />
              <p className="text-xs text-amber-700 dark:text-amber-300">
                {t.sdCompleteNoSignerWarning}
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
            disabled={isPending}
            onClick={() => mutation.mutate()}
            className="min-w-[9rem] gap-2 rounded-xl"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t.sdCompleting}
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                {t.sdComplete}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

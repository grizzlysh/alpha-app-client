import type { JSX } from "react";
import { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { SendHorizonal, Loader2 } from "lucide-react";
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
import type { PurchaseOrder } from "@/types/purchaseOrder";
import { submitPurchaseOrder } from "@/service/purchaseOrderService";

export interface PurchaseOrderSubmitModalProps {
  order: PurchaseOrder;
  onClose: () => void;
  onSuccess: (updated: PurchaseOrder) => void;
}

export function PurchaseOrderSubmitModal({
  order,
  onClose,
  onSuccess,
}: PurchaseOrderSubmitModalProps): JSX.Element {
  const queryClient = useQueryClient();
  const { t, language } = useLanguage();

  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  const mutation = useMutation({
    mutationFn: () => submitPurchaseOrder(order.uuid),
    onSuccess: (res) => {
      if (res.success && res.data) {
        queryClient.invalidateQueries({ queryKey: ["purchase-orders"] });
        toast.success(t.poSubmitSuccess);
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
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <SendHorizonal className="h-4 w-4 text-primary" />
          </div>
          <DialogTitle className="text-base">
            {t.poSubmitConfirmTitle}
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-5">
          <DialogDescription className="text-sm text-muted-foreground">
            {t.poSubmitConfirmDesc}
          </DialogDescription>
          <p className="mt-3 rounded-lg bg-muted px-3 py-2 text-sm font-medium text-foreground">
            {order.orderNumber} · <span className="uppercase">{order.distributor.name}</span>
          </p>
          {order.signedByUser && (
            <p className="mt-1 px-3 text-xs text-muted-foreground">
              {t.poSignedBy}: {order.signedByUser.name}
            </p>
          )}
          {!order.signedByUser && (
            <p className="mt-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-700 dark:border-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
              {t.poSubmitConfirmDesc}
            </p>
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
            disabled={isPending}
            onClick={() => mutation.mutate()}
            className="min-w-[8rem] gap-2 rounded-xl"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t.poSubmitting}
              </>
            ) : (
              <>
                <SendHorizonal className="h-4 w-4" />
                {t.poSubmit}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

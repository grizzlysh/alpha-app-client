import type { JSX } from "react";
import { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CheckCircle2, Loader2 } from "lucide-react";
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
import { completePurchaseOrder } from "@/service/purchaseOrderService";

export interface PurchaseOrderCompleteModalProps {
  order: PurchaseOrder;
  onClose: () => void;
  onSuccess: (updated: PurchaseOrder) => void;
}

export function PurchaseOrderCompleteModal({
  order,
  onClose,
  onSuccess,
}: PurchaseOrderCompleteModalProps): JSX.Element {
  const queryClient = useQueryClient();
  const { t, language } = useLanguage();

  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  const mutation = useMutation({
    mutationFn: () => completePurchaseOrder(order.uuid),
    onSuccess: (res) => {
      if (res.success && res.data) {
        queryClient.invalidateQueries({ queryKey: ["purchase-orders"] });
        toast.success(t.poCompleteSuccess);
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
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-success/10">
            <CheckCircle2 className="h-4 w-4 text-success" />
          </div>
          <DialogTitle className="text-base">
            {t.poMarkReceivedConfirmTitle}
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-5">
          <DialogDescription className="text-sm text-muted-foreground">
            {t.poMarkReceivedConfirmDesc}
          </DialogDescription>
          <div className="mt-3 rounded-lg bg-muted px-3 py-2 text-sm">
            <p className="font-medium text-foreground">
              {order.orderNumber}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              <span className="uppercase">{order.distributor.name}</span>
              {order.details.length > 0 && (
                <> · {order.details.length} {order.details.length === 1 ? t.poSingular : t.poPlural}</>
              )}
            </p>
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
            variant="success"
            disabled={isPending}
            onClick={() => mutation.mutate()}
            className="min-w-[9rem] gap-2 rounded-xl"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t.poMarkingReceived}
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                {t.poMarkReceived}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

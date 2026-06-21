import type { JSX } from "react";
import { useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Printer, Loader2 } from "lucide-react";
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
import {
  submitPurchaseOrder,
  getPurchaseOrderPrint,
} from "@/service/purchaseOrderService";
import { PurchaseOrderReceipt } from "./PurchaseOrderReceipt";

export interface PurchaseOrderPrintModalProps {
  order: PurchaseOrder;
  onClose: () => void;
  onSuccess: (updated: PurchaseOrder) => void;
}

export function PurchaseOrderPrintModal({
  order,
  onClose,
  onSuccess,
}: PurchaseOrderPrintModalProps): JSX.Element {
  const queryClient = useQueryClient();
  const { t, language } = useLanguage();

  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  const receiptRef = useRef<HTMLDivElement>(null);
  const [isPending, setIsPending] = useState(false);

  const isDraft = order.status === "DRAFT";

  const { data: printData } = useQuery({
    queryKey: ["purchase-order-print", order.uuid],
    queryFn: () => getPurchaseOrderPrint(order.uuid),
    staleTime: 5 * 60 * 1000,
  });

  function triggerBrowserPrint(): void {
    if (!receiptRef.current) return;

    const style = document.createElement("style");
    style.innerHTML = `
      @media print {
        body > *:not(#po-print-portal) { display: none !important; }
        #po-print-portal { display: block !important; }
        #po-print-portal > * { display: block !important; }
      }
    `;
    const portal = document.createElement("div");
    portal.id = "po-print-portal";
    portal.style.cssText =
      "position:fixed;inset:0;z-index:99999;background:#fff;display:none;";
    portal.innerHTML = receiptRef.current.outerHTML;

    document.head.appendChild(style);
    document.body.appendChild(portal);
    portal.style.display = "block";
    window.print();
    document.head.removeChild(style);
    document.body.removeChild(portal);
  }

  async function handlePrint(): Promise<void> {
    setIsPending(true);
    let current = order;

    try {
      if (isDraft) {
        const res = await submitPurchaseOrder(order.uuid);
        if (!res.success || !res.data) {
          toast.error(res.message[language]);
          return;
        }
        current = res.data;
        queryClient.invalidateQueries({ queryKey: ["purchase-orders"] });
        queryClient.invalidateQueries({
          queryKey: ["purchase-order-print", order.uuid],
        });
        toast.success(t.poSubmitSuccess);
      }

      triggerBrowserPrint();
      onSuccessRef.current(current);
    } catch (err) {
      toast.error(getApiErrorMessage(err, language, t.unexpectedError));
    } finally {
      setIsPending(false);
    }
  }

  const buttonLabel = isDraft ? t.poPrint : t.poReprint;

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !isPending) onClose();
      }}
    >
      <DialogContent
        className="flex max-h-[90vh] max-w-3xl flex-col gap-0 p-0"
        onInteractOutside={(e) => {
          if (isPending) e.preventDefault();
        }}
      >
        <DialogHeader className="flex flex-row items-center gap-3 space-y-0 border-b border-border px-6 py-4">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <Printer className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <DialogTitle className="text-base">
              {t.poSubmitConfirmTitle}
            </DialogTitle>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {order.orderNumber} · <span className="uppercase">{order.distributor.name}</span>
            </p>
          </div>
        </DialogHeader>

        {isDraft && (
          <div className="border-b border-border px-6 py-3">
            <DialogDescription className="text-sm text-muted-foreground">
              {t.poSubmitConfirmDesc}
            </DialogDescription>
          </div>
        )}

        {/* Receipt preview */}
        <div className="flex-1 overflow-y-auto bg-muted/30 p-4">
          <div className="flex justify-center">
            <div
              ref={receiptRef}
              className="shadow-md"
              style={{ transform: "scale(0.85)", transformOrigin: "top center" }}
            >
              <PurchaseOrderReceipt
                order={order}
                printData={printData?.data ?? null}
              />
            </div>
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
            disabled={isPending}
            onClick={() => void handlePrint()}
            className="min-w-[9rem] gap-2 rounded-xl"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t.poSubmitting}
              </>
            ) : (
              <>
                <Printer className="h-4 w-4" />
                {buttonLabel}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

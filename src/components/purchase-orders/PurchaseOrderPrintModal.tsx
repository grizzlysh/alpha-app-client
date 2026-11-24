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
import { openPrintTab } from "@/utils/printTab";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loadOrderLetterCopies, orderLetterCopyLabel, saveOrderLetterCopies } from "@/utils/orderLetter";
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

  // The sheets actually printed: every copy, each marked with what it is for.
  const printRef = useRef<HTMLDivElement>(null);
  const [isPending, setIsPending] = useState(false);
  const [copiesInput, setCopiesInput] = useState(() => String(loadOrderLetterCopies(order.kind)));
  const copies = Math.max(1, Math.min(10, Number(copiesInput) || 1));

  const isDraft = order.status === "DRAFT";

  const { data: printData } = useQuery({
    queryKey: ["purchase-order-print", order.uuid],
    queryFn: () => getPurchaseOrderPrint(order.uuid),
    staleTime: 5 * 60 * 1000,
  });

  function triggerBrowserPrint(): void {
    saveOrderLetterCopies(order.kind, copies);
    if (printRef.current) openPrintTab(order.orderNumber, printRef.current, "@page { size: A4; margin: 0; }");
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
        className="flex sm:max-h-[90vh] max-w-3xl flex-col gap-0 p-0"
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
              {order.orderNumber} · <span className="name-case">{order.distributor.name}</span>
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

        <div className="flex items-center gap-3 border-b border-border px-6 py-3">
          <Label htmlFor="po-copies" className="shrink-0">{t.poCopies}</Label>
          <Input
            id="po-copies"
            type="number"
            inputMode="numeric"
            min={1}
            max={10}
            value={copiesInput}
            onChange={(e) => setCopiesInput(e.target.value)}
            onBlur={() => setCopiesInput(String(copies))}
            className="w-20 rounded-xl"
          />
          {copies > 1 && <p className="min-w-0 text-xs text-muted-foreground">{t.poCopiesHint}</p>}
        </div>

        {/* Preview of the first sheet */}
        <div className="flex-1 overflow-y-auto bg-muted/30 p-4">
          <div className="flex justify-center">
            <div className="shadow-md" style={{ transform: "scale(0.85)", transformOrigin: "top center" }}>
              <PurchaseOrderReceipt
                order={order}
                printData={printData?.data ?? null}
                copyLabel={orderLetterCopyLabel(0, copies)}
              />
            </div>
          </div>
        </div>

        {/* Off-screen: what is sent to the printer, one page per copy */}
        <div aria-hidden style={{ position: "fixed", left: "-10000px", top: 0 }}>
          <div ref={printRef}>
            {Array.from({ length: copies }, (_, i) => (
              <div key={i} style={i < copies - 1 ? { breakAfter: "page", pageBreakAfter: "always" } : undefined}>
                <PurchaseOrderReceipt
                  order={order}
                  printData={printData?.data ?? null}
                  copyLabel={orderLetterCopyLabel(i, copies)}
                />
              </div>
            ))}
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

import type { JSX } from "react";
import { useRef } from "react";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { Printer, FileText, Loader2 } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { openPrintTab } from "@/utils/printTab";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { RootState } from "@/store";
import type { Sale } from "@/types/sale";
import { getPharmacy } from "@/service/pharmacyService";
import { getCustomer } from "@/service/customerService";
import { SaleReceiptDoc } from "./SaleReceiptDoc";
import { SaleInvoiceDoc } from "./SaleInvoiceDoc";

export interface SalePrintMeta {
  sale: Sale;
  cashierName: string;
  paymentMethodLabel: string;
  paymentStatusLabel: string;
  amountReceived: number;
}

export interface SalePrintModalProps {
  type: "receipt" | "invoice";
  meta: SalePrintMeta;
  onClose: () => void;
}

export function SalePrintModal({ type, meta, onClose }: SalePrintModalProps): JSX.Element {
  const { t, language } = useLanguage();
  const docRef = useRef<HTMLDivElement>(null);
  const currentPharmacy = useSelector((state: RootState) => state.auth.currentPharmacy);

  const { data: pharmacyData, isLoading: pharmacyLoading } = useQuery({
    queryKey: ["pharmacy-detail", currentPharmacy?.uuid],
    queryFn: () => getPharmacy(currentPharmacy!.uuid),
    enabled: !!currentPharmacy?.uuid,
    staleTime: 5 * 60 * 1000,
  });

  const { data: customerData, isLoading: customerLoading } = useQuery({
    queryKey: ["customer-detail", meta.sale.customer.uuid],
    queryFn: () => getCustomer(meta.sale.customer.uuid),
    enabled: !meta.sale.customer.isWalkIn,
    staleTime: 5 * 60 * 1000,
  });

  const pharmacy = pharmacyData?.data ?? null;
  const customer = customerData?.data ?? null;
  const isLoading = pharmacyLoading || (!meta.sale.customer.isWalkIn && customerLoading);

  const isReceipt = type === "receipt";
  const Icon = isReceipt ? Printer : FileText;
  const title = isReceipt ? t.posPrintReceipt : t.posPrintInvoice;

  function handlePrint(): void {
    if (docRef.current) openPrintTab(meta.sale.saleNumber, docRef.current);
  }

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="flex max-h-[90vh] max-w-3xl flex-col gap-0 p-0">
        <DialogHeader className="flex flex-row items-center gap-3 space-y-0 border-b border-border px-6 py-4">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <Icon className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <DialogTitle className="text-base">{title}</DialogTitle>
            <p className="mt-0.5 truncate text-xs text-muted-foreground uppercase">
              {meta.sale.saleNumber}
            </p>
          </div>
        </DialogHeader>

        {/* Document preview */}
        <div className="flex-1 overflow-y-auto bg-muted/30 p-4">
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="flex justify-center">
              <div
                ref={docRef}
                className="shadow-md"
                style={isReceipt ? undefined : { transform: "scale(0.85)", transformOrigin: "top center" }}
              >
                {isReceipt ? (
                  <SaleReceiptDoc
                    sale={meta.sale}
                    pharmacy={pharmacy}
                    cashierName={meta.cashierName}
                    paymentMethodLabel={meta.paymentMethodLabel}
                    amountReceived={meta.amountReceived}
                    t={t}
                    language={language}
                  />
                ) : (
                  <SaleInvoiceDoc
                    sale={meta.sale}
                    pharmacy={pharmacy}
                    customer={customer}
                    paymentMethodLabel={meta.paymentMethodLabel}
                    paymentStatusLabel={meta.paymentStatusLabel}
                    t={t}
                    language={language}
                  />
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-border px-6 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="rounded-xl"
          >
            {t.cancel}
          </Button>
          <Button
            type="button"
            onClick={handlePrint}
            disabled={isLoading}
            className="min-w-[9rem] gap-2 rounded-xl"
          >
            <Printer className="h-4 w-4" />
            {title}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

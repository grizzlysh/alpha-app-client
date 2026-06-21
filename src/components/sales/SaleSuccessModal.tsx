import type { JSX } from "react";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Printer, FileText, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { RootState } from "@/store";
import type { Translations } from "@/configs/i18n";
import type { Sale } from "@/types/sale";
import { getPharmacy } from "@/service/pharmacyService";
import { getCustomer } from "@/service/customerService";
import { printReceipt, printInvoice } from "@/utils/printDocument";
import { getPaymentMethodLabel, getSalePaymentStatusLabel, formatCurrency, formatDate } from "./salesUtils";

export interface SaleSuccessModalProps {
  sale: Sale;
  amountReceived: number;
  t: Translations;
  onNewSale: () => void;
}

export function SaleSuccessModal({ sale, amountReceived, t, onNewSale }: SaleSuccessModalProps): JSX.Element {
  const user = useSelector((state: RootState) => state.auth.user);
  const currentPharmacy = useSelector((state: RootState) => state.auth.currentPharmacy);

  const { data: pharmacyData } = useQuery({
    queryKey: ["pharmacy-detail", currentPharmacy?.uuid],
    queryFn: () => getPharmacy(currentPharmacy!.uuid),
    enabled: !!currentPharmacy?.uuid,
    staleTime: 5 * 60 * 1000,
  });

  const { data: customerData } = useQuery({
    queryKey: ["customer-detail", sale.customer.uuid],
    queryFn: () => getCustomer(sale.customer.uuid),
    enabled: !sale.customer.isWalkIn,
    staleTime: 5 * 60 * 1000,
  });

  const lastPaymentMethod = sale.payment?.history[sale.payment.history.length - 1]?.paymentMethod ?? "CASH";
  const paymentMethodLabel = getPaymentMethodLabel(lastPaymentMethod, t);
  const paymentStatusLabel = getSalePaymentStatusLabel(sale.payment?.paymentStatus ?? "UNPAID", t);
  const change = amountReceived - sale.grandTotal;

  const printMeta = {
    sale,
    pharmacy: pharmacyData?.data ?? null,
    customer: customerData?.data ?? null,
    cashierName: user?.name ?? "",
    paymentMethodLabel,
    paymentStatusLabel,
    amountReceived,
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onNewSale()}>
      <DialogContent className="grid max-w-2xl grid-cols-1 gap-0 overflow-hidden p-0 sm:grid-cols-[1fr,300px]">
        <div className="flex flex-col">
          <div className="border-b border-border px-6 py-4">
            <p className="text-xl font-bold text-foreground">{t.posSaleSuccessTitle}</p>
            <p className="mt-0.5 text-sm text-muted-foreground">{t.posReceiptSubtitle}</p>
          </div>

          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-10">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
              <CheckCircle2 className="h-8 w-8 text-success" />
            </div>
            <p className="text-3xl font-bold text-foreground">{formatCurrency(sale.grandTotal)}</p>
            <p className="text-sm text-muted-foreground">
              {t.posViaLabel} {paymentMethodLabel.toLowerCase()}
              {change > 0 && ` · ${t.posChangeLabel} ${formatCurrency(change)}`}
            </p>
          </div>
        </div>

        <div className="flex flex-col bg-muted/30 px-5 py-5">
          <p className="text-sm font-semibold text-foreground">
            {t.posReceiptLabel} · {sale.saleNumber}
          </p>

          <div className="mt-3 space-y-1.5 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t.posReceiptDateLabel}</span>
              <span className="text-foreground">{formatDate(sale.soldAt)}</span>
            </div>
            {user?.name && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t.posReceiptCashierLabel}</span>
                <span className="uppercase text-foreground">{user.name}</span>
              </div>
            )}
          </div>

          <div className="mt-3 space-y-1.5 border-t border-border pt-3">
            {sale.details.map((item) => (
              <div key={item.uuid} className="flex items-center justify-between gap-2 text-sm">
                <span className="min-w-0 flex-1 truncate text-foreground">
                  {item.quantityPieces}× <span className="uppercase">{item.medicine.name}</span>
                </span>
                <span className="shrink-0 text-foreground">{formatCurrency(item.totalAmount)}</span>
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-base font-bold text-foreground">
            <span>{t.saleTotalAmount}</span>
            <span>{formatCurrency(sale.grandTotal)}</span>
          </div>
        </div>

        <div className="col-span-full flex flex-col gap-2 border-t border-border bg-background px-6 py-4 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => printReceipt(printMeta)}
            className="gap-2 rounded-xl"
          >
            <Printer className="h-4 w-4" />
            {t.posPrintReceipt}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => printInvoice(printMeta)}
            className="gap-2 rounded-xl"
          >
            <FileText className="h-4 w-4" />
            {t.posPrintInvoice}
          </Button>
          <Button type="button" onClick={onNewSale} className="gap-2 rounded-xl">
            {t.posNewSale}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

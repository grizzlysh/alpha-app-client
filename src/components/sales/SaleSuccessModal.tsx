import type { JSX } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { CheckCircle2, Printer, FileText, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { RootState } from "@/store";
import type { Translations } from "@/configs/i18n";
import type { Sale } from "@/types/sale";
import { getPaymentMethodLabel, getSalePaymentStatusLabel, formatCurrency, formatDate } from "./salesUtils";
import { SalePrintModal, type SalePrintMeta } from "./SalePrintModal";

function formatDateTime(value: string): string {
  const d = new Date(value);
  const date = formatDate(value);
  const time = d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  return `${date} · ${time}`;
}

export interface SaleSuccessModalProps {
  sale: Sale;
  amountReceived: number;
  t: Translations;
  onNewSale: () => void;
}

export function SaleSuccessModal({ sale, amountReceived, t, onNewSale }: SaleSuccessModalProps): JSX.Element {
  const user = useSelector((state: RootState) => state.auth.user);

  const [printType, setPrintType] = useState<"receipt" | "invoice" | null>(null);

  const lastPaymentMethod = sale.payment?.history[sale.payment.history.length - 1]?.paymentMethod ?? "CASH";
  const paymentMethodLabel = getPaymentMethodLabel(lastPaymentMethod, t);
  const paymentStatusLabel = getSalePaymentStatusLabel(sale.payment?.paymentStatus ?? "UNPAID", t);
  const change = amountReceived - sale.grandTotal;

  const printMeta: SalePrintMeta = {
    sale,
    cashierName: user?.name ?? "",
    paymentMethodLabel,
    paymentStatusLabel,
    amountReceived,
  };

  return (
    <>
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
                <span className="text-foreground">{formatDateTime(sale.soldAt)}</span>
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

            <div className="mt-3 space-y-1 border-t border-border pt-3 text-sm">
              <div className="flex items-center justify-between text-muted-foreground">
                <span>{t.posSubtotal}</span>
                <span>{formatCurrency(sale.totalAmount)}</span>
              </div>
              {sale.ppnAmount > 0 && (
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>PPN ({sale.ppnPercentage}%)</span>
                  <span>{formatCurrency(sale.ppnAmount)}</span>
                </div>
              )}
              {sale.discountAmount > 0 && (
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>{t.posDiscountLabel}</span>
                  <span>-{formatCurrency(sale.discountAmount)}</span>
                </div>
              )}
            </div>

            <div className="mt-2 flex items-center justify-between border-t border-border pt-3 text-base font-bold text-foreground">
              <span>{t.saleTotalAmount}</span>
              <span>{formatCurrency(sale.grandTotal)}</span>
            </div>
          </div>

          <div className="col-span-full flex flex-col gap-2 border-t border-border bg-background px-6 py-4 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setPrintType("receipt")}
              className="gap-2 rounded-xl"
            >
              <Printer className="h-4 w-4" />
              {t.posPrintReceipt}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setPrintType("invoice")}
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

      {printType !== null && (
        <SalePrintModal
          type={printType}
          meta={printMeta}
          onClose={() => setPrintType(null)}
        />
      )}
    </>
  );
}

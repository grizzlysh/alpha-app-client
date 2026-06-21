import type { JSX } from "react";
import { useState } from "react";
import { CreditCard, Banknote, Handshake, Loader2, ArrowRight } from "lucide-react";

import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { Translations } from "@/configs/i18n";
import type { PaymentMethod, SaleType } from "@/types/sale";
import type { CartItem } from "./PosCartPanel";
import { formatCurrency } from "./salesUtils";

type PaymentOption = "CASH" | "CARD" | "CREDIT";

export interface PaymentConfirmation {
  saleType: SaleType;
  paymentMethod: PaymentMethod | null;
  amountReceived: number;
  discount: number;
  description: string;
}

export interface PosPaymentModalProps {
  t: Translations;
  items: CartItem[];
  subtotal: number;
  ppnPercentage: number;
  ppnAmount: number;
  total: number;
  customerUuid: string;
  customerLabel: string;
  isSubmitting: boolean;
  onCancel: () => void;
  onConfirm: (result: PaymentConfirmation) => void;
}

function parseAmount(raw: string): number {
  return parseInt(raw.replace(/[^0-9]/g, ""), 10) || 0;
}

export function PosPaymentModal({
  t,
  items,
  subtotal,
  ppnPercentage,
  ppnAmount,
  total,
  customerUuid,
  customerLabel,
  isSubmitting,
  onCancel,
  onConfirm,
}: PosPaymentModalProps): JSX.Element {
  const [option, setOption] = useState<PaymentOption>("CASH");
  const [discountInput, setDiscountInput] = useState("");
  const [downPaymentInput, setDownPaymentInput] = useState("");
  const [description, setDescription] = useState("");

  const isCreditDisabled = !customerUuid;

  const discount = Math.min(parseAmount(discountInput), total);
  const discountPercent = total > 0 ? Math.round((discount / total) * 100 * 10) / 10 : 0;
  const amountDue = Math.max(0, total - discount);
  const downPayment = option === "CREDIT" ? parseAmount(downPaymentInput) : 0;
  const remaining = amountDue - downPayment;

  function handleOptionChange(next: PaymentOption): void {
    if (next === "CREDIT" && isCreditDisabled) return;
    setOption(next);
    setDownPaymentInput("");
  }

  function handleConfirm(): void {
    if (isSubmitting) return;
    if (option === "CREDIT") {
      if (isCreditDisabled) return;
      onConfirm({ saleType: "CREDIT", paymentMethod: null, amountReceived: downPayment, discount, description });
      return;
    }
    onConfirm({
      saleType: "CASH",
      paymentMethod: option === "CASH" ? "CASH" : "TRANSFER",
      amountReceived: amountDue,
      discount,
      description,
    });
  }

  const confirmLabel =
    option === "CASH" ? t.posAcceptCash : option === "CARD" ? t.posAcceptCard : t.posAcceptCredit;
  const isConfirmDisabled = isSubmitting || (option === "CREDIT" && isCreditDisabled);

  return (
    <Dialog open onOpenChange={(open) => !open && !isSubmitting && onCancel()}>
      <DialogContent className="grid max-w-4xl grid-cols-1 gap-0 overflow-hidden p-0 sm:grid-cols-[1fr,400px]">
        {/* ── Left panel ── */}
        <div className="flex flex-col">
          <div className="border-b border-border px-6 py-4">
            <p className="text-xl font-bold text-foreground">
              {t.posPayLabel} {formatCurrency(total)}
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground">{t.posSelectPaymentMethod}</p>
          </div>

          <div className="space-y-5 px-6 py-5">
            {/* Payment method */}
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t.posMethodSectionLabel}
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleOptionChange("CASH")}
                  disabled={isSubmitting}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-colors",
                    option === "CASH" ? "border-success bg-success/10" : "border-border hover:border-primary/40"
                  )}
                >
                  <Banknote className="h-5 w-5 text-foreground" />
                  <span className="text-xs font-medium text-foreground">{t.posPaymentMethodCash}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOptionChange("CARD")}
                  disabled={isSubmitting}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-colors",
                    option === "CARD" ? "border-success bg-success/10" : "border-border hover:border-primary/40"
                  )}
                >
                  <CreditCard className="h-5 w-5 text-foreground" />
                  <span className="text-xs font-medium text-foreground">{t.posPaymentMethodCard}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOptionChange("CREDIT")}
                  disabled={isSubmitting || isCreditDisabled}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-colors",
                    option === "CREDIT" ? "border-success bg-success/10" : "border-border hover:border-primary/40",
                    isCreditDisabled && "cursor-not-allowed opacity-50"
                  )}
                >
                  <Handshake className="h-5 w-5 text-foreground" />
                  <span className="text-xs font-medium text-foreground">{t.posPaymentMethodCredit}</span>
                </button>
              </div>
              <p className="text-xs text-muted-foreground/70">
                {option === "CASH"
                  ? t.posPaymentMethodCashDesc
                  : option === "CARD"
                    ? t.posPaymentMethodCardDesc
                    : t.posPaymentMethodCreditDesc}
              </p>
              {isCreditDisabled && (
                <p className="text-xs text-muted-foreground/70">{t.posCreditRequiresCustomer}</p>
              )}
            </div>

            {/* Discount */}
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t.posDiscountLabel}
              </p>
              <input
                type="text"
                inputMode="numeric"
                value={discountInput}
                onChange={(e) => {
                  const digits = e.target.value.replace(/[^0-9]/g, "").replace(/^0+(?=\d)/, "");
                  const parsed = parseInt(digits, 10) || 0;
                  const clamped = Math.min(parsed, Math.floor(total));
                  setDiscountInput(clamped === 0 ? "" : String(clamped));
                }}
                readOnly={isSubmitting}
                placeholder="0"
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-base font-medium text-foreground outline-none focus:border-primary"
              />
              <p className="text-xs text-muted-foreground">
                {discountPercent}% {t.posDiscountLabel.toLowerCase()} · {t.saleTotalAmount}{" "}
                {formatCurrency(amountDue)}
              </p>
            </div>

            {/* Down payment — Credit only */}
            {option === "CREDIT" && (
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {t.posDownPaymentLabel}
                </p>
                <input
                  type="text"
                  inputMode="numeric"
                  value={downPaymentInput}
                  onChange={(e) =>
                    setDownPaymentInput(e.target.value.replace(/[^0-9]/g, "").replace(/^0+(?=\d)/, ""))
                  }
                  readOnly={isSubmitting}
                  placeholder="0"
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-base font-medium text-foreground outline-none focus:border-primary"
                />
              </div>
            )}

            {/* Note */}
            <div className="space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t.posAddNote}
              </p>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t.posDescriptionPlaceholder}
                rows={2}
                disabled={isSubmitting}
                className="rounded-xl bg-background"
              />
            </div>
          </div>
        </div>

        {/* ── Right panel (summary) ── */}
        <div className="flex flex-col bg-muted/30 px-5 py-5">
          <p className="text-sm font-semibold text-foreground">{t.posSummaryLabel}</p>
          <div className="mt-3 flex-1 space-y-1.5 overflow-y-auto">
            {items.map((item) => (
              <div key={item.stockDetailUuid} className="flex items-center justify-between gap-2 text-sm">
                <span className="min-w-0 flex-1 truncate text-foreground">
                  {item.quantityPieces}× <span className="uppercase">{item.medicineName}</span>
                </span>
                <span className="shrink-0 text-foreground">
                  {formatCurrency(item.unitPrice * item.quantityPieces * (1 - item.discount / 100))}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-1.5 border-t border-border pt-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t.posSubtotal}</span>
              <span className="text-foreground">{formatCurrency(subtotal)}</span>
            </div>
            {ppnPercentage > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  {t.saleTaxAmount} {ppnPercentage}%
                </span>
                <span className="text-foreground">{formatCurrency(ppnAmount)}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                {t.posDiscountLabel} ({discountPercent}%)
              </span>
              <span className={cn(discount > 0 ? "text-destructive" : "text-foreground")}>
                -{formatCurrency(discount)}
              </span>
            </div>
            <div className="flex items-center justify-between text-base font-bold text-foreground">
              <span>{t.saleTotalAmount}</span>
              <span>{formatCurrency(amountDue)}</span>
            </div>
            {option === "CREDIT" && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{t.posDownPaymentLabel}</span>
                  <span className="text-foreground">{formatCurrency(downPayment)}</span>
                </div>
                <div className="flex items-center justify-between font-medium text-foreground">
                  <span>{t.posRemainingLabel}</span>
                  <span>{formatCurrency(Math.max(0, remaining))}</span>
                </div>
              </>
            )}
          </div>

          <div className="mt-3 space-y-1 border-t border-border pt-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{t.posCustomerLabel}</span>
              <span className="text-foreground">{customerLabel}</span>
            </div>
          </div>
        </div>

        <div className="col-span-full flex justify-end gap-2 border-t border-border bg-background px-6 py-4">
          <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting} className="rounded-xl">
            {t.posPaymentCancel}
          </Button>
          <Button type="button" onClick={handleConfirm} disabled={isConfirmDisabled} className="gap-2 rounded-xl">
            {confirmLabel}
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

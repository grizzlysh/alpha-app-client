import type { JSX } from "react";
import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { Minus, Plus, Trash2, ShoppingCart, UserRound, Loader2, PauseCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Combobox, type ComboboxOption } from "@/components/ui/combobox";
import type { Translations } from "@/configs/i18n";
import { formatCurrency } from "./salesUtils";

export interface CartItem {
  stockDetailUuid: string;
  quantityPieces: number;
  discount: number;
  medicineName: string;
  unit: string;
  batchNumber: string;
  expiryDate: string;
  unitPrice: number;
  originalPrice: number;
  availablePieces: number;
}

export interface PosCartPanelProps {
  t: Translations;
  cart: CartItem[];
  onIncrement: (index: number) => void;
  onDecrement: (index: number) => void;
  onRemove: (index: number) => void;
  onPriceChange: (index: number, newPrice: number) => void;
  customerUuid: string;
  onCustomerChange: (value: string) => void;
  customerOptions: ComboboxOption[];
  subtotal: number;
  ppnPercentage: number;
  ppnAmount: number;
  total: number;
  resumedSaleNumber: string | null;
  onHold: () => void;
  onCheckout: () => void;
  isHolding: boolean;
  isCheckingOut: boolean;
  onReset: () => void;
  onOpenHeldSales: () => void;
}

export function PosCartPanel({
  t,
  cart,
  onIncrement,
  onDecrement,
  onRemove,
  onPriceChange,
  customerUuid,
  onCustomerChange,
  customerOptions,
  subtotal,
  ppnPercentage,
  ppnAmount,
  total,
  resumedSaleNumber,
  onHold,
  onCheckout,
  isHolding,
  isCheckingOut,
  onReset,
  onOpenHeldSales,
}: PosCartPanelProps): JSX.Element {
  const [draftCode] = useState(() => `DRAFT-${Date.now().toString(36).toUpperCase()}`);
  const transactionCode = resumedSaleNumber ?? draftCode;
  const [time, setTime] = useState(() => format(new Date(), "HH:mm"));
  const [editingPriceIndex, setEditingPriceIndex] = useState<number | null>(null);
  const [priceInput, setPriceInput] = useState("");
  const priceInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const interval = setInterval(() => setTime(format(new Date(), "HH:mm")), 30 * 1000);
    return () => clearInterval(interval);
  }, []);

  const isBusy = isHolding || isCheckingOut;

  function startEditingPrice(index: number, currentPrice: number): void {
    if (isBusy) return;
    setEditingPriceIndex(index);
    setPriceInput(String(currentPrice));
    setTimeout(() => priceInputRef.current?.select(), 0);
  }

  function commitPriceEdit(index: number): void {
    const parsed = parseInt(priceInput, 10);
    if (!isNaN(parsed) && parsed >= 0) {
      onPriceChange(index, parsed);
    }
    setEditingPriceIndex(null);
  }

  function handlePriceKeyDown(e: React.KeyboardEvent, index: number): void {
    if (e.key === "Enter") commitPriceEdit(index);
    if (e.key === "Escape") setEditingPriceIndex(null);
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Transaction header */}
      <div className="flex shrink-0 items-center justify-between border-b border-border px-6 py-4">
        <div>
          <p className="text-sm font-semibold text-foreground">{t.posTransactionLabel}</p>
          <p className="text-xs text-muted-foreground">
            {transactionCode} · {time}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenHeldSales}
            disabled={isBusy}
            className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground hover:underline disabled:opacity-50"
          >
            {t.posHeldSalesBtn}
          </button>
          <button
            type="button"
            onClick={onReset}
            disabled={isBusy}
            className="text-xs font-medium text-primary transition-colors hover:underline disabled:opacity-50"
          >
            {t.posReset}
          </button>
        </div>
      </div>

      {/* Customer */}
      <div className="shrink-0 space-y-1.5 border-b border-border px-6 py-4">
        <Label className="text-xs">{t.posCustomerLabel}</Label>
        <Combobox
          value={customerUuid}
          onValueChange={onCustomerChange}
          options={customerOptions}
          placeholder={t.posSelectCustomer}
          disabled={isBusy}
          className="rounded-xl"
        />
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5">
        {/* Cart items */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-foreground">
            {t.posCartSection}
            <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              {cart.length}
            </span>
          </p>

          {cart.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border bg-muted/20 px-4 py-10 text-center">
              <ShoppingCart className="h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">{t.posCartEmptyTitle}</p>
              <p className="text-xs text-muted-foreground/60">{t.posCartEmptyDesc}</p>
            </div>
          ) : (
            cart.map((item, index) => (
              <div
                key={item.stockDetailUuid}
                className="rounded-xl border border-border bg-muted/30 px-3 py-2.5"
              >
                <div className="flex items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium uppercase text-foreground">{item.medicineName}</p>
                    <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                      {editingPriceIndex === index ? (
                        <input
                          ref={priceInputRef}
                          type="text"
                          inputMode="numeric"
                          value={priceInput}
                          onChange={(e) => setPriceInput(e.target.value.replace(/[^0-9]/g, "").replace(/^0+(?=\d)/, ""))}
                          onBlur={() => commitPriceEdit(index)}
                          onKeyDown={(e) => handlePriceKeyDown(e, index)}
                          className="w-24 rounded border border-primary bg-background px-1.5 py-0.5 text-xs text-foreground outline-none"
                        />
                      ) : (
                        <>
                          {item.unitPrice !== item.originalPrice && (
                            <span className="line-through opacity-50">
                              {formatCurrency(item.originalPrice)}
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => startEditingPrice(index, item.unitPrice)}
                            disabled={isBusy}
                            className="underline decoration-dashed underline-offset-2 transition-colors hover:text-foreground disabled:no-underline disabled:opacity-60"
                          >
                            {formatCurrency(item.unitPrice)}
                          </button>
                        </>
                      )}
                      <span>/ {item.unit}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemove(index)}
                    disabled={isBusy}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex items-center gap-1 rounded-lg border border-border bg-background">
                    <button
                      type="button"
                      onClick={() => onDecrement(index)}
                      disabled={isBusy}
                      className="flex h-7 w-7 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="min-w-[2rem] text-center text-sm font-medium text-foreground">
                      {item.quantityPieces}
                    </span>
                    <button
                      type="button"
                      onClick={() => onIncrement(index)}
                      disabled={isBusy || item.quantityPieces >= item.availablePieces}
                      className="flex h-7 w-7 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  {item.unitPrice < item.originalPrice && (
                    <span className="text-xs text-destructive">
                      -{formatCurrency(item.originalPrice - item.unitPrice)}/{item.unit}
                    </span>
                  )}
                  <span className="ml-auto text-sm font-semibold text-foreground">
                    {formatCurrency(item.unitPrice * item.quantityPieces * (1 - item.discount / 100))}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Totals + actions */}
      <div className="shrink-0 space-y-2 border-t border-border bg-muted/20 p-5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{t.posSubtotal}</span>
          <span className="font-semibold text-foreground">{formatCurrency(subtotal)}</span>
        </div>
        {ppnPercentage > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {t.saleTaxAmount} ({ppnPercentage}%)
            </span>
            <span className="font-semibold text-foreground">{formatCurrency(ppnAmount)}</span>
          </div>
        )}
        <div className="flex items-center justify-between border-t border-border pt-2 text-base font-bold text-foreground">
          <span>{t.saleTotalAmount}</span>
          <span>{formatCurrency(total)}</span>
        </div>
        <div className="flex gap-2 pt-1">
          <Button
            type="button"
            variant="outline"
            onClick={onHold}
            disabled={isBusy || cart.length === 0}
            className="flex-1 gap-2 rounded-xl"
          >
            {isHolding ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <PauseCircle className="h-4 w-4" />
            )}
            {isHolding ? t.posHolding : t.posHold}
          </Button>
          <Button
            type="button"
            onClick={onCheckout}
            disabled={isBusy || cart.length === 0}
            className="flex-1 gap-2 rounded-xl"
          >
            {isCheckingOut ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t.posProcessing}
              </>
            ) : (
              <>
                <UserRound className="h-4 w-4" />
                {t.posCheckout}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

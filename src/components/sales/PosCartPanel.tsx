import type { JSX } from "react";
import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { History, Minus, Plus, Trash2, ShoppingCart, Loader2, PauseCircle, Lock, Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Combobox, type ComboboxOption } from "@/components/ui/combobox";
import { cn } from "@/utils/cn";
import type { Translations } from "@/configs/i18n";
import { lineTotal, splitBoxes } from "@/utils/saleMath";
import { formatCurrency } from "./salesUtils";
import { AllergyWarning } from "@/components/shared/AllergyWarning";

export interface CartItem {
  stockDetailUuid: string;
  /** For the allergy check. */
  medicineUuid?: string;
  quantityPieces: number;
  discount: number;
  medicineName: string;
  unit: string;
  batchNumber: string;
  expiryDate: string;
  unitPrice: number;
  originalPrice: number;
  availablePieces: number;
  quantityPerBox: number;
  requiresPrescription: boolean;
}

export interface PosCartPanelProps {
  t: Translations;
  cart: CartItem[];
  onQuantityChange: (index: number, quantity: number) => void;
  onRemove: (index: number) => void;
  onPriceChange: (index: number, newPrice: number) => void;
  /** Without sales.override_price the price is shown read-only. */
  canEditPrice: boolean;
  customerUuid: string;
  onCustomerChange: (value: string) => void;
  customerOptions: ComboboxOption[];
  /** Opens the selected customer's purchase history; omitted without sales.read. */
  onOpenHistory?: () => void;
  prescriptionUuid: string;
  onPrescriptionChange: (value: string) => void;
  prescriptionOptions: ComboboxOption[];
  onAddPrescription: () => void;
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
  onQuantityChange,
  onRemove,
  onPriceChange,
  canEditPrice,
  customerUuid,
  onCustomerChange,
  customerOptions,
  onOpenHistory,
  prescriptionUuid,
  onPrescriptionChange,
  prescriptionOptions,
  onAddPrescription,
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
  const hasRxItems = cart.some((item) => item.requiresPrescription);
  const rxFieldsEnabled = hasRxItems || !!prescriptionUuid;

  function startEditingPrice(index: number, currentPrice: number): void {
    if (isBusy || !canEditPrice) return;
    setEditingPriceIndex(index);
    setPriceInput(String(currentPrice));
    setTimeout(() => priceInputRef.current?.select(), 0);
  }

  function commitPriceEdit(index: number): void {
    const parsed = parseInt(priceInput, 10);
    if (!isNaN(parsed) && parsed > 0) onPriceChange(index, parsed);
    setEditingPriceIndex(null);
  }

  function handlePriceKeyDown(e: React.KeyboardEvent, index: number): void {
    if (e.key === "Enter") commitPriceEdit(index);
    if (e.key === "Escape") setEditingPriceIndex(null);
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      {/* Transaction header */}
      <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3 sm:px-5">
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

      {/* Patient + prescription, side by side when there's room */}
      <div className="grid shrink-0 gap-3 border-b border-border px-4 py-3 sm:grid-cols-2 sm:px-5">
        <div className="min-w-0 space-y-1.5">
          <div className="flex items-center justify-between">
            <Label className="text-xs">{t.posPatientLabel}</Label>
            {onOpenHistory && customerUuid && (
              <button
                type="button"
                onClick={onOpenHistory}
                className="flex items-center gap-1 rounded-md px-1 text-[11px] font-medium text-primary transition-colors hover:bg-primary/10"
              >
                <History className="h-3.5 w-3.5" aria-hidden />
                {t.purchaseHistoryShort}
              </button>
            )}
          </div>
          <Combobox
            value={customerUuid}
            onValueChange={onCustomerChange}
            options={customerOptions}
            placeholder={t.posSelectPatient}
            disabled={isBusy}
            className="rounded-xl"
          />
        </div>
        <div className="min-w-0 space-y-1.5">
          <div className="flex items-center justify-between">
            <Label className={cn("text-xs", !rxFieldsEnabled && "text-muted-foreground/50")}>
              {t.posPrescriptionLabel}
              {hasRxItems && <span className="ml-1 text-destructive">*</span>}
            </Label>
            <button
              type="button"
              onClick={onAddPrescription}
              disabled={isBusy || !rxFieldsEnabled}
              aria-label={t.posCreatePrescriptionButton}
              title={t.posCreatePrescriptionButton}
              className="flex h-5 w-5 items-center justify-center rounded-md text-primary transition-colors hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          <Combobox
            value={prescriptionUuid}
            onValueChange={onPrescriptionChange}
            options={prescriptionOptions}
            placeholder={t.posPrescriptionPlaceholder}
            disabled={isBusy || !rxFieldsEnabled}
            className="rounded-xl"
          />
        </div>
      </div>

      {/* Cart items */}
      <div className="flex shrink-0 items-center justify-between px-4 pt-3 sm:px-5">
        <p className="text-sm font-semibold text-foreground">
          {t.posCartSection}
          <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
            {cart.length}
          </span>
        </p>
        {!canEditPrice && cart.length > 0 && (
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground" title={t.posPriceLockedHint}>
            <Lock className="h-3 w-3" aria-hidden />
            {t.posPriceLockedHint}
          </span>
        )}
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3 sm:px-5">
        <div className="space-y-2">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border bg-muted/20 px-4 py-10 text-center">
              <ShoppingCart className="h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">{t.posCartEmptyTitle}</p>
              <p className="text-xs text-muted-foreground/60">{t.posCartEmptyDesc}</p>
            </div>
          ) : (
            cart.map((item, index) => (
              <CartRow
                key={item.stockDetailUuid}
                t={t}
                item={item}
                isBusy={isBusy}
                canEditPrice={canEditPrice}
                isEditingPrice={editingPriceIndex === index}
                priceInput={priceInput}
                priceInputRef={priceInputRef}
                onPriceInput={setPriceInput}
                onStartEditPrice={() => startEditingPrice(index, item.unitPrice)}
                onCommitPrice={() => commitPriceEdit(index)}
                onPriceKeyDown={(e) => handlePriceKeyDown(e, index)}
                onQuantityChange={(q) => onQuantityChange(index, q)}
                onRemove={() => onRemove(index)}
              />
            ))
          )}
        </div>
      </div>

      {/* Totals + actions */}
      <div className="shrink-0 space-y-2 border-t border-border bg-muted/20 px-4 py-4 sm:px-5">
        <AllergyWarning customerUuid={customerUuid} items={cart.map((i) => ({ medicineUuid: i.medicineUuid, medicineName: i.medicineName }))} />
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
            {isHolding ? <Loader2 className="h-4 w-4 animate-spin" /> : <PauseCircle className="h-4 w-4" />}
            {isHolding ? t.posHolding : t.posHold}
            <kbd className="ml-1 hidden rounded border border-border px-1 text-[10px] font-medium text-muted-foreground lg:inline">F8</kbd>
          </Button>
          <Button
            type="button"
            onClick={onCheckout}
            disabled={isBusy || cart.length === 0}
            className="flex-[1.4] gap-2 rounded-xl"
          >
            {isCheckingOut ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t.posProcessing}
              </>
            ) : (
              <>
                <Wallet className="h-4 w-4" />
                {t.posCheckout}
                <kbd className="ml-1 hidden rounded border border-primary-foreground/30 px-1 text-[10px] font-medium lg:inline">F9</kbd>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Cart row ──────────────────────────────────────────────────────────────────

interface CartRowProps {
  t: Translations;
  item: CartItem;
  isBusy: boolean;
  canEditPrice: boolean;
  isEditingPrice: boolean;
  priceInput: string;
  priceInputRef: React.RefObject<HTMLInputElement | null>;
  onPriceInput: (value: string) => void;
  onStartEditPrice: () => void;
  onCommitPrice: () => void;
  onPriceKeyDown: (e: React.KeyboardEvent) => void;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
}

function CartRow({
  t,
  item,
  isBusy,
  canEditPrice,
  isEditingPrice,
  priceInput,
  priceInputRef,
  onPriceInput,
  onStartEditPrice,
  onCommitPrice,
  onPriceKeyDown,
  onQuantityChange,
  onRemove,
}: CartRowProps): JSX.Element {
  // Local text state so the cashier can clear the field and type a new number.
  const [qtyText, setQtyText] = useState(String(item.quantityPieces));
  useEffect(() => setQtyText(String(item.quantityPieces)), [item.quantityPieces]);

  const overStock = item.quantityPieces > item.availablePieces;
  const priceChanged = item.unitPrice !== item.originalPrice;
  const perBox = item.quantityPerBox > 1 ? item.quantityPerBox : 0;
  const split = splitBoxes(item.quantityPieces, perBox);

  function commitQty(): void {
    const parsed = parseInt(qtyText, 10);
    if (isNaN(parsed) || parsed <= 0) {
      setQtyText(String(item.quantityPieces));
      return;
    }
    onQuantityChange(parsed);
  }

  return (
    <div
      className={cn(
        "rounded-xl border bg-muted/30 px-3 py-2.5",
        overStock ? "border-destructive/60" : "border-border"
      )}
    >
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="truncate text-sm font-medium name-case text-foreground">{item.medicineName}</p>
            {item.requiresPrescription && (
              <span
                title={t.posRxRequiredBadge}
                className="shrink-0 rounded-md bg-destructive/10 px-1.5 py-0.5 text-[10px] font-semibold text-destructive"
              >
                Rx
              </span>
            )}
          </div>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-xs text-muted-foreground">
            <span className="uppercase">{item.batchNumber}</span>
            <span aria-hidden>·</span>
            {isEditingPrice ? (
              <input
                ref={priceInputRef}
                type="text"
                inputMode="numeric"
                value={priceInput}
                aria-label={t.posEditPriceHint}
                onChange={(e) => onPriceInput(e.target.value.replace(/[^0-9]/g, "").replace(/^0+(?=\d)/, ""))}
                onBlur={onCommitPrice}
                onKeyDown={onPriceKeyDown}
                className="w-24 rounded border border-primary bg-background px-1.5 py-0.5 text-xs text-foreground outline-none"
              />
            ) : (
              <>
                {priceChanged && (
                  <span className="line-through opacity-50">{formatCurrency(item.originalPrice)}</span>
                )}
                {canEditPrice ? (
                  <button
                    type="button"
                    onClick={onStartEditPrice}
                    disabled={isBusy}
                    title={t.posEditPriceHint}
                    className="underline decoration-dashed underline-offset-2 transition-colors hover:text-foreground disabled:no-underline disabled:opacity-60"
                  >
                    {formatCurrency(item.unitPrice)}
                  </button>
                ) : (
                  <span>{formatCurrency(item.unitPrice)}</span>
                )}
              </>
            )}
            <span>/ {item.unit}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={onRemove}
          disabled={isBusy}
          aria-label={`${t.posRemoveItem} ${item.medicineName}`}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <div
          className={cn(
            "flex items-center rounded-lg border bg-background",
            overStock ? "border-destructive" : "border-border"
          )}
        >
          <button
            type="button"
            onClick={() => onQuantityChange(item.quantityPieces - 1)}
            disabled={isBusy}
            aria-label="-1"
            className="flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <input
            type="text"
            inputMode="numeric"
            value={qtyText}
            disabled={isBusy}
            aria-label={`${t.posQtyLabel} ${item.medicineName}`}
            onChange={(e) => setQtyText(e.target.value.replace(/[^0-9]/g, ""))}
            onFocus={(e) => e.target.select()}
            onBlur={commitQty}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                commitQty();
                (e.target as HTMLInputElement).blur();
              }
              if (e.key === "Escape") setQtyText(String(item.quantityPieces));
            }}
            className="h-8 w-12 border-x border-border bg-transparent text-center text-sm font-medium text-foreground outline-none focus:bg-primary/5"
          />
          <button
            type="button"
            onClick={() => onQuantityChange(item.quantityPieces + 1)}
            disabled={isBusy || item.quantityPieces >= item.availablePieces}
            aria-label="+1"
            className="flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>

        {perBox > 0 && (
          <button
            type="button"
            onClick={() => onQuantityChange(item.quantityPieces + perBox)}
            disabled={isBusy || item.quantityPieces + perBox > item.availablePieces}
            title={`1 ${t.posBoxUnit} = ${perBox} ${item.unit}`}
            className="rounded-lg border border-dashed border-border px-2 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground disabled:opacity-40"
          >
            {t.posAddBox}
          </button>
        )}

        <span className="text-[11px] text-muted-foreground">
          {split.boxes > 0 && `${split.boxes} ${t.posBoxUnit}${split.pieces ? ` + ${split.pieces} ${item.unit}` : ""} · `}
          {t.posAvailableShort.replace("{n}", String(item.availablePieces))}
        </span>

        <span className="ml-auto text-sm font-semibold text-foreground">{formatCurrency(lineTotal(item))}</span>
      </div>

      {overStock && (
        <p className="mt-1 text-xs font-medium text-destructive">
          {t.posStockInsufficient} — {t.posAvailableShort.replace("{n}", String(item.availablePieces))}
        </p>
      )}
    </div>
  );
}

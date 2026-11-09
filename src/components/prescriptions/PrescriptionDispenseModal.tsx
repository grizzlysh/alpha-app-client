import type { JSX } from "react";
import { useState, useMemo } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Pill, ChevronRight, ChevronLeft, Loader2, AlertCircle } from "lucide-react";

import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Combobox } from "@/components/ui/combobox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLanguage } from "@/hooks/useLanguage";
import { getApiErrorMessage } from "@/utils/apiError";
import { LiveToastMessage } from "@/components/shared/LiveToastMessage";
import type { Prescription, DispenseItemPayload } from "@/types/prescription";
import { dispensePrescription } from "@/service/prescriptionService";
import { axiosInstance } from "@/configs/axiosInstance";
import type { ApiResponse } from "@/types/api";

// ── Stock batch type ──────────────────────────────────────────────────────────

interface StockDetail {
  uuid: string;
  batchNumber: string | null;
  expiryDate: string | null;
  sellingPrice: number;
  quantity: number;
  medicine: { uuid: string; name: string };
}

async function getStockForMedicine(
  medicineUuid: string
): Promise<ApiResponse<StockDetail[]>> {
  const res = await axiosInstance.get<ApiResponse<StockDetail[]>>(
    `/stock/available`,
    { params: { medicineUuid } }
  );
  return res.data;
}

// ── Step 1 item state ─────────────────────────────────────────────────────────

interface ItemDispenseState {
  detailUuid: string;
  medicineName: string;
  medicineUuid: string | null;
  prescribedQty: number;
  dispensedQty: number;
  stockDetailUuid: string;
  sellingPrice: number;
  originalPrice: number;
}

// ── Step 1: Items & stock ─────────────────────────────────────────────────────

interface Step1Props {
  prescription: Prescription;
  items: ItemDispenseState[];
  onChange: (items: ItemDispenseState[]) => void;
}

function Step1({ prescription, items, onChange }: Step1Props): JSX.Element {
  const { t } = useLanguage();

  function update(index: number, patch: Partial<ItemDispenseState>): void {
    const next = [...items];
    next[index] = { ...next[index], ...patch };
    onChange(next);
  }

  return (
    <div className="space-y-4">
      <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        {t.prescriptionDispenseStepItems}
      </p>
      {prescription.details
        .filter((d) => d.status === "PENDING" || d.status === "PARTIAL")
        .map((detail, idx) => {
          const state = items[idx];
          if (!state) return null;
          return (
            <StockItemRow
              key={detail.uuid}
              detail={detail}
              state={state}
              onUpdate={(patch) => update(idx, patch)}
            />
          );
        })}
    </div>
  );
}

// ── Stock item row ────────────────────────────────────────────────────────────

interface StockItemRowProps {
  detail: Prescription["details"][number];
  state: ItemDispenseState;
  onUpdate: (patch: Partial<ItemDispenseState>) => void;
}

function StockItemRow({ detail, state, onUpdate }: StockItemRowProps): JSX.Element {
  const { t } = useLanguage();
  const remaining = detail.qty - detail.dispensedQty;

  const { data: stockData } = useQuery({
    queryKey: ["stock-available", detail.medicine?.uuid],
    queryFn: () => getStockForMedicine(detail.medicine!.uuid),
    enabled: !!detail.medicine?.uuid,
    staleTime: 30 * 1000,
  });

  const stockOptions = useMemo(
    () =>
      (stockData?.data ?? []).map((s) => ({
        value: s.uuid,
        label: s.batchNumber
          ? `${s.batchNumber} — ${s.quantity} left (Rp ${s.sellingPrice.toLocaleString()})`
          : `Batch ${s.uuid.slice(0, 8)} — ${s.quantity} left`,
      })),
    [stockData]
  );

  function handleStockChange(stockUuid: string): void {
    const found = stockData?.data?.find((s) => s.uuid === stockUuid);
    onUpdate({
      stockDetailUuid: stockUuid,
      sellingPrice: found?.sellingPrice ?? 0,
      originalPrice: found?.sellingPrice ?? 0,
    });
  }

  return (
    <div className="rounded-xl border border-border bg-muted/20 p-4">
      <p className="mb-3 font-medium text-sm text-foreground">
        {detail.medicineName}
        <span className="ml-2 text-xs text-muted-foreground">
          ({remaining} {t.prescriptionItemDispensedOf} {detail.qty})
        </span>
      </p>

      <div className="grid gap-3 sm:grid-cols-3">
        {/* Stock batch */}
        <div className="space-y-1.5 sm:col-span-3">
          <Label className="text-xs">{t.prescriptionDispenseStockBatch}</Label>
          {detail.medicine ? (
            <Combobox
              value={state.stockDetailUuid}
              onValueChange={handleStockChange}
              options={stockOptions}
              placeholder={t.prescriptionDispenseStockBatch}
              className="h-9 w-full rounded-lg text-sm"
            />
          ) : (
            <div className="flex h-9 items-center rounded-lg border border-border bg-muted/40 px-3 text-sm text-muted-foreground">
              {detail.medicineName}
            </div>
          )}
        </div>

        {/* Qty to dispense */}
        <div className="space-y-1.5">
          <Label className="text-xs">{t.prescriptionDispenseQty}</Label>
          <Input
            type="number"
            min={1}
            max={remaining}
            value={state.dispensedQty}
            onChange={(e) => onUpdate({ dispensedQty: Math.min(Number(e.target.value), remaining) })}
            className="h-9 text-sm"
          />
        </div>

        {/* Original price */}
        <div className="space-y-1.5">
          <Label className="text-xs">{t.prescriptionDispenseOriginalPrice}</Label>
          <Input
            type="number"
            min={0}
            value={state.originalPrice}
            onChange={(e) => onUpdate({ originalPrice: Number(e.target.value) })}
            className="h-9 text-sm"
          />
        </div>

        {/* Selling price */}
        <div className="space-y-1.5">
          <Label className="text-xs">{t.prescriptionDispenseSellingPrice}</Label>
          <Input
            type="number"
            min={0}
            value={state.sellingPrice}
            onChange={(e) => onUpdate({ sellingPrice: Number(e.target.value) })}
            className="h-9 text-sm"
          />
        </div>
      </div>
    </div>
  );
}

// ── Step 2: Payment ───────────────────────────────────────────────────────────

type SaleType = "CASH" | "CREDIT";
type PaymentMethod = "CASH" | "TRANSFER" | "DEBIT" | "CREDIT_CARD" | "QRIS";

interface PaymentState {
  saleType: SaleType;
  paymentMethod: PaymentMethod;
  grandTotal: number;
}

interface Step2Props {
  items: ItemDispenseState[];
  payment: PaymentState;
  onChange: (p: PaymentState) => void;
}

function Step2({ items, payment, onChange }: Step2Props): JSX.Element {
  const { t } = useLanguage();

  const subtotal = items.reduce((sum, item) => sum + item.sellingPrice * item.dispensedQty, 0);

  const saleTypeOptions = [
    { value: "CASH", label: t.prescriptionSaleTypeCash },
    { value: "CREDIT", label: t.prescriptionSaleTypeCredit },
  ];

  const paymentOptions = [
    { value: "CASH", label: t.prescriptionPaymentCash },
    { value: "TRANSFER", label: t.prescriptionPaymentTransfer },
    { value: "DEBIT", label: t.prescriptionPaymentDebit },
    { value: "CREDIT_CARD", label: t.prescriptionPaymentCreditCard },
    { value: "QRIS", label: t.prescriptionPaymentQris },
  ];

  return (
    <div className="space-y-4">
      <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        {t.prescriptionDispenseStepPayment}
      </p>

      {/* Item summary */}
      <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-2">
        {items.map((item) => (
          <div key={item.detailUuid} className="flex items-center justify-between text-sm">
            <span className="text-foreground">
              {item.medicineName} × {item.dispensedQty}
            </span>
            <span className="font-medium text-foreground">
              Rp {(item.sellingPrice * item.dispensedQty).toLocaleString()}
            </span>
          </div>
        ))}
        <div className="border-t border-border pt-2 flex items-center justify-between">
          <span className="text-sm font-semibold text-foreground">{t.prescriptionDispenseTotalAmount}</span>
          <span className="font-bold text-foreground">Rp {subtotal.toLocaleString()}</span>
        </div>
      </div>

      {/* Sale type */}
      <div className="space-y-1.5">
        <Label>{t.prescriptionDispenseSaleType}</Label>
        <div className="flex gap-2">
          {saleTypeOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange({ ...payment, saleType: opt.value as SaleType })}
              className={cn(
                "flex-1 rounded-xl border py-2 text-sm font-medium transition-colors",
                payment.saleType === opt.value
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-background text-muted-foreground hover:border-primary/40"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Payment method — only for CASH */}
      {payment.saleType === "CASH" && (
        <div className="space-y-1.5">
          <Label>{t.prescriptionDispensePaymentMethod}</Label>
          <div className="grid grid-cols-3 gap-2">
            {paymentOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange({ ...payment, paymentMethod: opt.value as PaymentMethod })}
                className={cn(
                  "rounded-xl border py-2 text-sm font-medium transition-colors",
                  payment.paymentMethod === opt.value
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-background text-muted-foreground hover:border-primary/40"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Grand total */}
      <div className="space-y-1.5">
        <Label>{t.prescriptionDispenseGrandTotal}</Label>
        <Input
          type="number"
          min={0}
          value={payment.grandTotal || subtotal}
          onChange={(e) => onChange({ ...payment, grandTotal: Number(e.target.value) })}
          className="text-lg font-bold"
        />
      </div>
    </div>
  );
}

// ── Main modal ────────────────────────────────────────────────────────────────

export interface PrescriptionDispenseModalProps {
  prescription: Prescription;
  onClose: () => void;
  onSuccess: () => void;
}

export function PrescriptionDispenseModal({
  prescription,
  onClose,
  onSuccess,
}: PrescriptionDispenseModalProps): JSX.Element {
  const { t, language } = useLanguage();
  const queryClient = useQueryClient();
  const [step, setStep] = useState<1 | 2>(1);

  const pendingDetails = prescription.details.filter(
    (d) => d.status === "PENDING" || d.status === "PARTIAL"
  );

  const [dispenseItems, setDispenseItems] = useState<ItemDispenseState[]>(
    pendingDetails.map((d) => ({
      detailUuid: d.uuid,
      medicineName: d.medicineName,
      medicineUuid: d.medicine?.uuid ?? null,
      prescribedQty: d.qty,
      dispensedQty: d.qty - d.dispensedQty,
      stockDetailUuid: "",
      sellingPrice: 0,
      originalPrice: 0,
    }))
  );

  const subtotal = dispenseItems.reduce(
    (sum, item) => sum + item.sellingPrice * item.dispensedQty,
    0
  );

  const [payment, setPayment] = useState<PaymentState>({
    saleType: "CASH",
    paymentMethod: "CASH",
    grandTotal: subtotal,
  });

  const dispenseMutation = useMutation({
    mutationFn: (payload: Parameters<typeof dispensePrescription>[1]) =>
      dispensePrescription(prescription.uuid, payload),
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ["prescriptions"] });
        queryClient.invalidateQueries({ queryKey: ["prescription", prescription.uuid] });
        toast.success(<LiveToastMessage getMessage={(t) => t.prescriptionDispenseSuccess} />);
        onSuccess();
      } else {
        toast.error(res.message[language]);
      }
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, language, t.unexpectedError));
    },
  });

  const step1Valid = dispenseItems.every((item) => item.stockDetailUuid || !item.medicineUuid);

  const validationError = step === 2 && !step1Valid
    ? "Please select stock batches for all items with linked medicines."
    : null;

  function handleDispense(): void {
    const items: DispenseItemPayload[] = dispenseItems.map((item) => ({
      detailUuid: item.detailUuid,
      dispensedQty: item.dispensedQty,
      stockDetailUuid: item.stockDetailUuid,
      sellingPrice: item.sellingPrice,
      originalPrice: item.originalPrice,
    }));

    const grandTotal = payment.grandTotal || subtotal;

    dispenseMutation.mutate({
      items,
      saleType: payment.saleType,
      totalAmount: subtotal,
      grandTotal,
      payment:
        payment.saleType === "CASH"
          ? { paymentMethod: payment.paymentMethod }
          : undefined,
    });
  }

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !dispenseMutation.isPending) onClose();
      }}
    >
      <DialogContent
        className="max-w-lg p-0"
        onInteractOutside={(e) => {
          if (dispenseMutation.isPending) e.preventDefault();
        }}
      >
        <DialogHeader className="flex flex-row items-center gap-3 space-y-0 border-b border-border px-6 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
            <Pill className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1">
            <DialogTitle className="text-base">{t.prescriptionDispenseTitle}</DialogTitle>
            <p className="text-xs text-muted-foreground">{prescription.customer.name}</p>
          </div>
          {/* Step indicator */}
          <div className="flex items-center gap-1.5">
            {[1, 2].map((s) => (
              <div
                key={s}
                className={cn(
                  "h-2 w-2 rounded-full transition-colors",
                  step === s ? "bg-primary" : "bg-muted-foreground/30"
                )}
              />
            ))}
          </div>
        </DialogHeader>

        <div className="max-h-[65vh] overflow-y-auto px-6 py-5">
          {step === 1 ? (
            <Step1
              prescription={prescription}
              items={dispenseItems}
              onChange={setDispenseItems}
            />
          ) : (
            <Step2
              items={dispenseItems}
              payment={payment}
              onChange={setPayment}
            />
          )}

          {validationError && (
            <p className="mt-3 flex items-center gap-1.5 text-xs text-destructive">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              {validationError}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border px-6 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => (step === 1 ? onClose() : setStep(1))}
            disabled={dispenseMutation.isPending}
            className="gap-1.5 rounded-xl"
          >
            {step === 2 && <ChevronLeft className="h-4 w-4" />}
            {step === 1 ? t.cancel : t.prescriptionDispenseBack}
          </Button>

          {step === 1 ? (
            <Button
              type="button"
              className="gap-1.5 rounded-xl"
              onClick={() => setStep(2)}
            >
              {t.prescriptionDispenseNext}
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleDispense}
              disabled={dispenseMutation.isPending}
              className="min-w-[8rem] gap-1.5 rounded-xl"
            >
              {dispenseMutation.isPending ? (
                <><Loader2 className="h-4 w-4 animate-spin" />{t.prescriptionDispensing}</>
              ) : (
                <><Pill className="h-4 w-4" />{t.prescriptionDispense}</>
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

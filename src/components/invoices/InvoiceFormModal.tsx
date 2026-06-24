import type { JSX } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  useForm,
  useFieldArray,
  Controller,
  type SubmitHandler,
} from "react-hook-form";
import type { RootState } from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Receipt,
  Loader2,
  Plus,
  Pencil,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Combobox } from "@/components/ui/combobox";
import { DateInput } from "@/components/ui/date-input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLanguage } from "@/hooks/useLanguage";
import type { Translations } from "@/configs/i18n";
import { getApiErrorMessage } from "@/utils/apiError";
import type { Invoice, CreateInvoicePayload } from "@/types/invoice";
import type { MedicineDropdownItem } from "@/types/medicine";
import { createInvoice } from "@/service/invoiceService";
import { getDistributorsDropdown } from "@/service/distributorService";
import { getMedicinesDropdown } from "@/service/medicineService";
import { getUsers } from "@/service/userService";
import { getPurchaseOrder, getPurchaseOrdersDropdown } from "@/service/purchaseOrderService";
import { getBusinessParameters } from "@/service/businessParameterService";
import { getCabinetsDropdown, getShelvesDropdown, getBinsDropdown } from "@/service/storageService";
import { formatCurrency, formatCurrencyDecimal } from "./invoiceUtils";

// ── Helpers ───────────────────────────────────────────────────────────────────

function addOneMonth(dateStr: string): string {
  const parts = dateStr.split("-");
  const d = new Date(Number(parts[0]), Number(parts[1]), Number(parts[2]));
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("-");
}

// ── Main form schema ──────────────────────────────────────────────────────────

function makeSchema(t: Translations) {
  return z
    .object({
      distributorUuid: z.string().min(1, t.invoiceDistributorRequired),
      purchaseOrderUuid: z.string().optional(),
      signedByUuid: z.string().min(1, t.invoiceSignedByRequired),
      invoiceNumber: z.string().min(1, t.invoiceNumberRequired),
      invoiceDate: z.string().min(1, t.invoiceDateRequired),
      dueDate: z.string().min(1, t.invoiceDueDateRequired),
      receiveDate: z.string().min(1, t.invoiceReceiveDateRequired),
      description: z.string().optional(),
      ppnEnabled: z.boolean(),
      details: z
        .array(
          z.object({
            medicineUuid: z.string(),
            batchNumber: z.string(),
            expiryDate: z.string(),
            quantityBox: z.number(),
            quantityPerBox: z.number(),
            quantityPieces: z.number(),
            price: z.number(),
            discountPercentage: z.number(),
            fromPo: z.boolean().optional(),
            binUuid: z.string().optional(),
            binLabel: z.string().optional(),
            cabinetUuid: z.string().optional(),
            shelfUuid: z.string().optional(),
          })
        )
        .min(1, t.invoiceItemsRequired),
    })
    .superRefine((data, ctx) => {
      if (data.receiveDate && data.invoiceDate && data.receiveDate <= data.invoiceDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t.invoiceReceiveDateAfterInvoice,
          path: ["receiveDate"],
        });
      }
    });
}

interface FormValues {
  distributorUuid: string;
  purchaseOrderUuid: string;
  signedByUuid: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  receiveDate: string;
  description: string;
  ppnEnabled: boolean;
  details: {
    medicineUuid: string;
    batchNumber: string;
    expiryDate: string;
    quantityBox: number;
    quantityPerBox: number;
    quantityPieces: number;
    price: number;
    discountPercentage: number;
    fromPo?: boolean;
    binUuid?: string;
    binLabel?: string;
    cabinetUuid?: string;
    shelfUuid?: string;
  }[];
}

// ── Item sub-form state ───────────────────────────────────────────────────────

interface ItemFormState {
  medicineUuid: string;
  batchNumber: string;
  expiryDate: string;
  quantityBox: string;
  quantityPerBox: string;
  quantityPieces: string;
  price: string;
  discountPercentage: string;
  cabinetUuid: string;
  shelfUuid: string;
  binUuid: string;
  binLabel: string;
}

interface ItemFormErrors {
  medicineUuid?: string;
  batchNumber?: string;
  expiryDate?: string;
  quantityBox?: string;
  quantityPerBox?: string;
  price?: string;
}

const EMPTY_ITEM: ItemFormState = {
  medicineUuid: "",
  batchNumber: "",
  expiryDate: "",
  quantityBox: "1",
  quantityPerBox: "1",
  quantityPieces: "1",
  price: "",
  discountPercentage: "0",
  cabinetUuid: "",
  shelfUuid: "",
  binUuid: "",
  binLabel: "",
};

// ── Item sub-form ─────────────────────────────────────────────────────────────

interface ItemFormProps {
  value: ItemFormState;
  errors: ItemFormErrors;
  medicineOptions: { value: string; label: string }[];
  cabinetOptions: { value: string; label: string }[];
  loadingMedicines: boolean;
  isPending: boolean;
  t: Translations;
  onChange: (next: ItemFormState) => void;
  onClearError: (field: keyof ItemFormErrors) => void;
  onAdd: () => void;
}

function ItemForm({
  value,
  errors,
  medicineOptions,
  cabinetOptions,
  loadingMedicines,
  isPending,
  t,
  onChange,
  onClearError,
  onAdd,
}: ItemFormProps): JSX.Element {
  const { data: shelvesData, isLoading: loadingShelves } = useQuery({
    queryKey: ["shelves-dropdown", value.cabinetUuid],
    queryFn: () => getShelvesDropdown(value.cabinetUuid),
    enabled: !!value.cabinetUuid,
    staleTime: 5 * 60 * 1000,
  });

  const { data: binsData, isLoading: loadingBins } = useQuery({
    queryKey: ["bins-dropdown", value.cabinetUuid, value.shelfUuid],
    queryFn: () => getBinsDropdown(value.cabinetUuid, value.shelfUuid),
    enabled: !!value.cabinetUuid && !!value.shelfUuid,
    staleTime: 5 * 60 * 1000,
  });

  const shelfOptions = useMemo(
    () => (shelvesData?.data ?? []).map((s) => ({ value: s.uuid, label: `${s.name} (${s.code})` })),
    [shelvesData?.data]
  );

  const binOptions = useMemo(
    () => (binsData?.data ?? []).map((b) => ({ value: b.uuid, label: `${b.name} (${b.code})` })),
    [binsData?.data]
  );

  function handleQtyChange(field: "quantityBox" | "quantityPerBox", raw: string): void {
    const trimmed = raw.replace(/^0+(?=\d)/, "");
    const next = { ...value, [field]: trimmed };
    const box = Number(field === "quantityBox" ? trimmed : value.quantityBox);
    const perBox = Number(field === "quantityPerBox" ? trimmed : value.quantityPerBox);
    if (!isNaN(box) && !isNaN(perBox) && box > 0 && perBox > 0) {
      next.quantityPieces = String(box * perBox);
    }
    onChange(next);
    onClearError(field);
  }

  const price = Number(value.price) || 0;
  const qtyBox = Number(value.quantityBox) || 0;
  const discPct = Number(value.discountPercentage) || 0;
  const grossTotal = price * qtyBox;
  const discountNominal = Math.round((discPct / 100) * grossTotal * 100) / 100;
  const itemTotal = Math.round((grossTotal - discountNominal) * 100) / 100;

  return (
    <div className="rounded-xl border border-border bg-muted/20 p-4">
      <div className="grid grid-cols-[2fr_1fr_1fr] gap-3">

        {/* Row 1 — Medicine | Qty Box | Qty Per Box */}
        <div className="space-y-1">
          <Label className="text-xs">{t.invoiceItemMedicine}</Label>
          <Combobox
            value={value.medicineUuid}
            onValueChange={(uuid) => { onChange({ ...value, medicineUuid: uuid }); onClearError("medicineUuid"); }}
            options={medicineOptions}
            placeholder={loadingMedicines ? `${t.invoiceItemSelectMedicine}...` : t.invoiceItemSelectMedicine}
            disabled={isPending || loadingMedicines}
          />
          {errors.medicineUuid && (
            <p className="flex items-center gap-1 text-xs text-destructive">
              <AlertCircle className="h-3 w-3" />
              {errors.medicineUuid}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label className="text-xs">{t.invoiceItemQtyBox}</Label>
          <Input
            type="number"
            min={1}
            value={value.quantityBox}
            onChange={(e) => handleQtyChange("quantityBox", e.target.value)}
            disabled={isPending}
            className={cn("rounded-xl", errors.quantityBox && "border-destructive")}
          />
          {errors.quantityBox && (
            <p className="flex items-center gap-1 text-xs text-destructive">
              <AlertCircle className="h-3 w-3 shrink-0" />
              {errors.quantityBox}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label className="text-xs">{t.invoiceItemQtyPerBox}</Label>
          <Input
            type="number"
            min={1}
            value={value.quantityPerBox}
            onChange={(e) => handleQtyChange("quantityPerBox", e.target.value)}
            disabled={isPending}
            className={cn("rounded-xl", errors.quantityPerBox && "border-destructive")}
          />
          {errors.quantityPerBox && (
            <p className="flex items-center gap-1 text-xs text-destructive">
              <AlertCircle className="h-3 w-3 shrink-0" />
              {errors.quantityPerBox}
            </p>
          )}
        </div>

        {/* Row 2 — Batch | Qty Pieces (readonly) | Price/Box */}
        <div className="space-y-1">
          <Label className="text-xs">{t.invoiceItemBatchNumber}</Label>
          <Input
            value={value.batchNumber}
            onChange={(e) => { onChange({ ...value, batchNumber: e.target.value }); onClearError("batchNumber"); }}
            placeholder={t.invoiceItemBatchNumberPlaceholder}
            disabled={isPending}
            className={cn("rounded-xl", errors.batchNumber && "border-destructive")}
          />
          {errors.batchNumber && (
            <p className="flex items-center gap-1 text-xs text-destructive">
              <AlertCircle className="h-3 w-3 shrink-0" />
              {errors.batchNumber}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">{t.invoiceItemQtyPieces}</Label>
          <Input
            type="number"
            value={value.quantityPieces}
            readOnly
            disabled
            className="cursor-not-allowed rounded-xl bg-muted/50 text-muted-foreground"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs">{t.invoiceItemPrice}</Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={value.price}
            onChange={(e) => { onChange({ ...value, price: e.target.value.replace(/^0+(?=\d)/, "") }); onClearError("price"); }}
            placeholder="0"
            disabled={isPending}
            className={cn("rounded-xl", errors.price && "border-destructive")}
          />
          {errors.price && (
            <p className="flex items-center gap-1 text-xs text-destructive">
              <AlertCircle className="h-3 w-3 shrink-0" />
              {errors.price}
            </p>
          )}
        </div>

        {/* Row 3 — Expiry Date | Disc% | Disc Nominal */}
        <div className="space-y-1">
          <Label className="text-xs">{t.invoiceItemExpiryDate}</Label>
          <DateInput
            value={value.expiryDate}
            onChange={(v) => { onChange({ ...value, expiryDate: v }); onClearError("expiryDate"); }}
            disabled={isPending}
            placeholder={t.invoiceItemExpiryDate}
            className={cn("rounded-xl", errors.expiryDate && "border-destructive")}
          />
          {errors.expiryDate && (
            <p className="flex items-center gap-1 text-xs text-destructive">
              <AlertCircle className="h-3 w-3 shrink-0" />
              {errors.expiryDate}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label className="text-xs">{t.invoiceItemDiscount}</Label>
          <Input
            type="text"
            inputMode="decimal"
            value={value.discountPercentage}
            onChange={(e) => {
              const raw = e.target.value.replace(/^0+(?=\d)/, "");
              if (raw !== "" && !/^\d*\.?\d{0,2}$/.test(raw)) return;
              if (raw !== "" && !isNaN(parseFloat(raw)) && parseFloat(raw) > 100) {
                onChange({ ...value, discountPercentage: "100" });
                return;
              }
              onChange({ ...value, discountPercentage: raw });
            }}
            onFocus={(e) => {
              if (e.target.value === "0") onChange({ ...value, discountPercentage: "" });
            }}
            onBlur={(e) => {
              if (e.target.value === "" || e.target.value === ".") {
                onChange({ ...value, discountPercentage: "0" });
              }
            }}
            disabled={isPending}
            className="rounded-xl"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">{t.invoiceDiscountNominal}</Label>
          <div className="flex h-10 items-center rounded-xl border border-border bg-muted/50 px-3 text-sm">
            {discountNominal > 0 ? (
              <span className="text-destructive">{formatCurrencyDecimal(discountNominal)}</span>
            ) : (
              <span className="text-muted-foreground">—</span>
            )}
          </div>
        </div>

        {/* Row 4 — Storage Location (optional) */}
        <div className="col-span-3 grid grid-cols-3 gap-3">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">{t.invoiceItemCabinet}</Label>
            <Combobox
              value={value.cabinetUuid}
              onValueChange={(uuid) => onChange({ ...value, cabinetUuid: uuid, shelfUuid: "", binUuid: "", binLabel: "" })}
              options={cabinetOptions}
              placeholder={t.invoiceItemCabinet}
              disabled={isPending}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">{t.invoiceItemShelf}</Label>
            <Combobox
              value={value.shelfUuid}
              onValueChange={(uuid) => onChange({ ...value, shelfUuid: uuid, binUuid: "", binLabel: "" })}
              options={shelfOptions}
              placeholder={loadingShelves ? "..." : t.invoiceItemShelf}
              disabled={isPending || !value.cabinetUuid || loadingShelves}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">{t.invoiceItemBin}</Label>
            <Combobox
              value={value.binUuid}
              onValueChange={(uuid) => {
                const label = binOptions.find((b) => b.value === uuid)?.label ?? "";
                onChange({ ...value, binUuid: uuid, binLabel: label });
              }}
              options={binOptions}
              placeholder={loadingBins ? "..." : t.invoiceItemSelectBin}
              disabled={isPending || !value.shelfUuid || loadingBins}
            />
          </div>
        </div>

        {/* Row 5 — Add button + Item Total */}
        <div className="col-span-3 flex items-center gap-3">
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-10 gap-1.5 rounded-xl px-5 text-xs"
            disabled={isPending}
            onClick={onAdd}
          >
            <Plus className="h-3.5 w-3.5" />
            {t.invoiceItemAdd}
          </Button>
          <div className="flex h-10 flex-1 items-center justify-between rounded-xl border border-border bg-background px-3.5">
            <span className="text-xs text-muted-foreground">{t.invoiceItemTotal}</span>
            <span className="text-sm font-semibold text-foreground">{formatCurrencyDecimal(itemTotal)}</span>
          </div>
        </div>

      </div>
    </div>
  );
}

// ── Items table ───────────────────────────────────────────────────────────────

interface CommittedItem {
  medicineUuid: string;
  batchNumber: string;
  expiryDate: string;
  quantityBox: number;
  quantityPerBox: number;
  quantityPieces: number;
  price: number;
  discountPercentage: number;
  binUuid?: string;
  binLabel?: string;
  cabinetUuid?: string;
  shelfUuid?: string;
}

interface ItemsTableProps {
  items: CommittedItem[];
  medicines: MedicineDropdownItem[];
  isPending: boolean;
  t: Translations;
  onEdit: (index: number) => void;
  onRemove: (index: number) => void;
}

function ItemsTable({
  items,
  medicines,
  isPending,
  t,
  onEdit,
  onRemove,
}: ItemsTableProps): JSX.Element {
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted">
            <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">#</th>
            <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t.invoiceItemMedicine}
            </th>
            <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t.invoiceItemQtyBox}
            </th>
            <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t.invoiceItemQtyPerBox}
            </th>
            <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t.invoiceItemQtyPieces}
            </th>
            <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t.invoiceItemTotal}
            </th>
            <th className="w-16 px-3 py-2" />
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {items.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-3 py-5 text-center text-xs text-muted-foreground">
                {t.invoiceItemsRequired}
              </td>
            </tr>
          ) : (
            items.map((item, index) => {
              const med = medicines.find((m) => m.uuid === item.medicineUuid);
              const grossTotal = item.price * item.quantityBox;
              const discountNominal = Math.round((item.discountPercentage / 100) * grossTotal * 100) / 100;
              const itemTotal = Math.round((grossTotal - discountNominal) * 100) / 100;
              const isIncomplete = !item.batchNumber.trim() || !item.expiryDate;
              return (
                <tr key={index} className={cn("transition-colors hover:bg-accent/40", isIncomplete && "bg-amber-50/60 dark:bg-amber-950/20")}>
                  <td className="px-3 py-2.5 text-xs text-muted-foreground">{index + 1}</td>
                  <td className="px-3 py-2.5">
                    <p className="font-medium uppercase text-foreground">{med?.name ?? item.medicineUuid}</p>
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs uppercase text-muted-foreground">{item.batchNumber || "—"}</p>
                      {isIncomplete && (
                        <span className="whitespace-nowrap rounded bg-amber-100/80 px-1.5 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                          {t.invoiceItemIncomplete}
                        </span>
                      )}
                    </div>
                    {item.binLabel && (
                      <p className="mt-0.5 text-xs text-muted-foreground/70">{item.binLabel}</p>
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-right text-foreground">{item.quantityBox}</td>
                  <td className="px-3 py-2.5 text-right text-foreground">{item.quantityPerBox}</td>
                  <td className="px-3 py-2.5 text-right text-foreground">{item.quantityPieces}</td>
                  <td className="px-3 py-2.5 text-right">
                    <p className="font-medium text-foreground">
                      {isIncomplete ? "—" : formatCurrencyDecimal(itemTotal)}
                    </p>
                    {item.discountPercentage > 0 && (
                      <p className="mt-0.5 text-xs text-muted-foreground">{item.discountPercentage}% off</p>
                    )}
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onEdit(index)}
                        disabled={isPending}
                        className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onRemove(index)}
                        disabled={isPending}
                        className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

// ── InvoiceFormModal ──────────────────────────────────────────────────────────

export interface InvoiceFormModalProps {
  onClose: () => void;
  onSuccess: (invoice: Invoice) => void;
}

export function InvoiceFormModal({
  onClose,
  onSuccess,
}: InvoiceFormModalProps): JSX.Element {
  const queryClient = useQueryClient();
  const { t, language } = useLanguage();
  const pharmacyUuid = useSelector((state: RootState) => state.auth.currentPharmacy?.uuid);

  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  // ── Item sub-form state ─────────────────────────────────────────────────────
  const [itemForm, setItemForm] = useState<ItemFormState>(EMPTY_ITEM);
  const [itemErrors, setItemErrors] = useState<ItemFormErrors>({});

  // ── Main form ───────────────────────────────────────────────────────────────
  const schema = useMemo(() => makeSchema(t), [t]);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    clearErrors,
    getValues,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      distributorUuid: "",
      purchaseOrderUuid: "",
      signedByUuid: "",
      invoiceNumber: "",
      invoiceDate: "",
      dueDate: "",
      receiveDate: "",
      description: "",
      ppnEnabled: false,
      details: [],
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "details",
  });

  // PPN rate from business parameters
  const { data: ppnParametersData } = useQuery({
    queryKey: ["business-parameters", "PPN_PERCENTAGE_BUY", pharmacyUuid],
    queryFn: () => getBusinessParameters({ search: "PPN_PERCENTAGE_BUY", pharmacyUuid }),
    staleTime: 5 * 60 * 1000,
  });

  const ppnPercentage = useMemo(() => {
    const param = ppnParametersData?.data?.find((p) => p.key === "PPN_PERCENTAGE_BUY");
    return param ? parseFloat(param.value) : 0;
  }, [ppnParametersData]);

  // Invoice-level computed totals
  const ppnEnabled = watch("ppnEnabled");
  const watchedPOUuid = watch("purchaseOrderUuid");
  const subtotal = fields.reduce((sum, item) => {
    const gross = item.price * item.quantityBox;
    const disc = (item.discountPercentage / 100) * gross;
    return sum + gross - disc;
  }, 0);
  const ppnAmount = ppnEnabled ? (ppnPercentage / 100) * subtotal : 0;
  const grandTotal = subtotal + ppnAmount;

  const hasIncompleteItems = fields.some(
    (item) => !item.batchNumber.trim() || !item.expiryDate
  );

  // ── PO auto-populate ────────────────────────────────────────────────────────
  const prevPopulatedPORef = useRef<string | null>(null);
  const editingFromPoRef = useRef<boolean>(false);

  useEffect(() => {
    if (!watchedPOUuid) {
      if (prevPopulatedPORef.current !== null) {
        replace(getValues("details").filter((item) => !item.fromPo));
      }
      prevPopulatedPORef.current = null;
      return;
    }
    if (prevPopulatedPORef.current === watchedPOUuid) return;
    prevPopulatedPORef.current = watchedPOUuid;

    getPurchaseOrder(watchedPOUuid).then((res) => {
      if (res.data) {
        const nonPoItems = getValues("details").filter((item) => !item.fromPo);
        replace([
          ...nonPoItems,
          ...res.data.details.map((detail) => ({
            medicineUuid: detail.medicine.uuid,
            batchNumber: "",
            expiryDate: "",
            quantityBox: detail.quantity,
            quantityPerBox: 1,
            quantityPieces: detail.quantity,
            price: 0,
            discountPercentage: 0,
            fromPo: true as const,
          })),
        ]);
      }
    }).catch(() => {});
  }, [watchedPOUuid, replace, getValues]);

  // ── Remote data ─────────────────────────────────────────────────────────────
  const { data: cabinetsData } = useQuery({
    queryKey: ["cabinets-dropdown"],
    queryFn: () => getCabinetsDropdown(),
    staleTime: 5 * 60 * 1000,
  });

  const { data: distributorsData, isLoading: loadingDistributors } = useQuery({
    queryKey: ["distributors-dropdown"],
    queryFn: () => getDistributorsDropdown(),
    staleTime: 5 * 60 * 1000,
  });

  const { data: medicinesData, isLoading: loadingMedicines } = useQuery({
    queryKey: ["medicines-dropdown"],
    queryFn: () => getMedicinesDropdown(),
    staleTime: 5 * 60 * 1000,
  });

  const { data: usersData } = useQuery({
    queryKey: ["users-all"],
    queryFn: () => getUsers({ limit: 100 }),
    staleTime: 5 * 60 * 1000,
  });

  const { data: purchaseOrdersData } = useQuery({
    queryKey: ["purchase-orders-dropdown"],
    queryFn: () => getPurchaseOrdersDropdown(),
    staleTime: 5 * 60 * 1000,
  });

  const cabinetOptions = useMemo(
    () => (cabinetsData?.data ?? []).map((c) => ({ value: c.uuid, label: `${c.name} (${c.code})` })),
    [cabinetsData?.data]
  );

  const distributorOptions = useMemo(
    () => (distributorsData?.data ?? []).map((d) => ({ value: d.uuid, label: d.name?.toUpperCase() ?? d.name })),
    [distributorsData?.data]
  );

  const medicines = useMemo(
    () => medicinesData?.data ?? [],
    [medicinesData?.data]
  );

  const medicineOptions = useMemo(
    () => medicines.map((m) => ({ value: m.uuid, label: m.name?.toUpperCase() ?? m.name })),
    [medicines]
  );

  const signerOptions = useMemo(
    () => [
      { value: "", label: t.invoiceSelectSignedBy },
      ...(usersData?.data ?? []).map((u) => ({ value: u.uuid, label: u.name })),
    ],
    [usersData?.data, t.invoiceSelectSignedBy]
  );

  const purchaseOrderOptions = useMemo(
    () => [
      { value: "", label: t.invoiceSelectPurchaseOrder },
      ...(purchaseOrdersData?.data ?? [])
        .filter((po) => po.status === "SENT")
        .map((po) => ({ value: po.uuid, label: `${po.orderNumber} · ${po.distributorName.toUpperCase()}` })),
    ],
    [purchaseOrdersData?.data, t.invoiceSelectPurchaseOrder]
  );

  // ── Item sub-form handlers ──────────────────────────────────────────────────
  function validateItemForm(): boolean {
    const errs: ItemFormErrors = {};
    if (!itemForm.medicineUuid) errs.medicineUuid = t.invoiceItemMedicineRequired;
    if (!itemForm.batchNumber.trim()) errs.batchNumber = t.invoiceItemBatchNumberRequired;
    if (!itemForm.expiryDate) errs.expiryDate = t.invoiceItemExpiryDateRequired;

    const box = Number(itemForm.quantityBox);
    if (!itemForm.quantityBox || isNaN(box) || box < 1 || !Number.isInteger(box)) {
      errs.quantityBox = t.invoiceItemQtyBoxRequired;
    }
    const perBox = Number(itemForm.quantityPerBox);
    if (!itemForm.quantityPerBox || isNaN(perBox) || perBox < 1 || !Number.isInteger(perBox)) {
      errs.quantityPerBox = t.invoiceItemQtyPerBoxRequired;
    }
    const price = Number(itemForm.price);
    if (itemForm.price === "" || isNaN(price) || price < 0) {
      errs.price = t.invoiceItemPriceRequired;
    }

    setItemErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleAddItem(): void {
    if (!validateItemForm()) return;

    append({
      medicineUuid: itemForm.medicineUuid,
      batchNumber: itemForm.batchNumber.trim(),
      expiryDate: itemForm.expiryDate,
      quantityBox: Number(itemForm.quantityBox),
      quantityPerBox: Number(itemForm.quantityPerBox),
      quantityPieces: Number(itemForm.quantityPieces),
      price: Number(itemForm.price),
      discountPercentage: Number(itemForm.discountPercentage) || 0,
      fromPo: editingFromPoRef.current,
      ...(itemForm.binUuid ? { binUuid: itemForm.binUuid, binLabel: itemForm.binLabel, cabinetUuid: itemForm.cabinetUuid, shelfUuid: itemForm.shelfUuid } : {}),
    });
    editingFromPoRef.current = false;

    setItemForm(EMPTY_ITEM);
    setItemErrors({});
  }

  function handleEditItem(index: number): void {
    const item = fields[index];
    editingFromPoRef.current = item.fromPo ?? false;
    setItemForm({
      medicineUuid: item.medicineUuid,
      batchNumber: item.batchNumber,
      expiryDate: item.expiryDate,
      quantityBox: String(item.quantityBox),
      quantityPerBox: String(item.quantityPerBox),
      quantityPieces: String(item.quantityPieces),
      price: String(item.price),
      discountPercentage: String(item.discountPercentage),
      cabinetUuid: item.cabinetUuid ?? "",
      shelfUuid: item.shelfUuid ?? "",
      binUuid: item.binUuid ?? "",
      binLabel: item.binLabel ?? "",
    });
    remove(index);
    setItemErrors({});
  }

  function handleRemoveItem(index: number): void {
    remove(index);
  }

  // ── Mutation ────────────────────────────────────────────────────────────────
  const mutation = useMutation({
    mutationFn: (values: FormValues) => {
      const payload: CreateInvoicePayload = {
        distributorUuid: values.distributorUuid,
        invoiceNumber: values.invoiceNumber,
        invoiceDate: values.invoiceDate,
        ...(values.purchaseOrderUuid ? { purchaseOrderUuid: values.purchaseOrderUuid } : {}),
        ...(values.signedByUuid ? { signedByUuid: values.signedByUuid } : {}),
        ...(values.dueDate ? { dueDate: values.dueDate } : {}),
        ...(values.receiveDate ? { receiveDate: values.receiveDate } : {}),
        ...(values.description ? { description: values.description } : {}),
        ...(values.ppnEnabled ? { ppnEnabled: true } : {}),
        details: values.details.map((d) => ({
          medicineUuid: d.medicineUuid,
          batchNumber: d.batchNumber,
          expiryDate: d.expiryDate,
          quantityBox: d.quantityBox,
          quantityPerBox: d.quantityPerBox,
          quantityPieces: d.quantityPieces,
          price: d.price,
          ...(d.discountPercentage > 0 ? { discountPercentage: d.discountPercentage } : {}),
          ...(d.binUuid ? { binUuid: d.binUuid } : {}),
        })),
      };
      return createInvoice(payload);
    },
    onSuccess: (res) => {
      if (res.success && res.data) {
        queryClient.invalidateQueries({ queryKey: ["invoices"] });
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
  const isDataLoading = loadingDistributors || loadingMedicines;

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    mutation.mutate(values);
  };

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !isPending) onClose();
      }}
    >
      <DialogContent
        className="flex max-h-[90vh] max-w-6xl flex-col gap-0 p-0"
        onInteractOutside={(e) => e.preventDefault()}
      >
        {/* Header */}
        <DialogHeader className="flex flex-row items-center gap-3 space-y-0 border-b border-border px-6 py-4">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <Receipt className="h-4 w-4 text-primary" />
          </div>
          <DialogTitle className="text-base">{t.invoiceAdd}</DialogTitle>
        </DialogHeader>

        {/* Two-panel body */}
        <form
          id="invoice-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row"
        >
          {/* ── Left panel — header fields ─────────────────────────────── */}
          <div className="space-y-4 overflow-y-auto px-6 py-5 lg:w-[360px] lg:flex-shrink-0 lg:border-r lg:border-border">
            {/* Invoice number */}
            <div className="space-y-1.5">
              <Label>{t.invoiceNumber}</Label>
              <Input
                {...register("invoiceNumber")}
                placeholder={t.invoiceNumberPlaceholder}
                disabled={isPending}
                className={cn("rounded-xl", errors.invoiceNumber && "border-destructive")}
              />
              {errors.invoiceNumber && (
                <p className="flex items-center gap-1 text-xs text-destructive">
                  <AlertCircle className="h-3 w-3" />
                  {errors.invoiceNumber.message}
                </p>
              )}
            </div>

            {/* Distributor */}
            <div className="space-y-1.5">
              <Label>{t.invoiceDistributor}</Label>
              <Controller
                name="distributorUuid"
                control={control}
                render={({ field }) => (
                  <Combobox
                    value={field.value}
                    onValueChange={field.onChange}
                    options={distributorOptions}
                    placeholder={
                      loadingDistributors
                        ? `${t.invoiceSelectDistributor}...`
                        : t.invoiceSelectDistributor
                    }
                    disabled={isPending || loadingDistributors}
                  />
                )}
              />
              {errors.distributorUuid && (
                <p className="flex items-center gap-1 text-xs text-destructive">
                  <AlertCircle className="h-3 w-3" />
                  {errors.distributorUuid.message}
                </p>
              )}
            </div>

            {/* Invoice date | Due date */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>{t.invoiceDate}</Label>
                <Controller
                  name="invoiceDate"
                  control={control}
                  render={({ field }) => (
                    <DateInput
                      value={field.value}
                      onChange={(v) => {
                        field.onChange(v);
                        if (v) {
                          setValue("dueDate", addOneMonth(v));
                          clearErrors("dueDate");
                        }
                      }}
                      disabled={isPending}
                      placeholder={t.invoiceDate}
                      className={cn("rounded-xl", errors.invoiceDate && "border-destructive")}
                    />
                  )}
                />
                {errors.invoiceDate && (
                  <p className="flex items-center gap-1 text-xs text-destructive">
                    <AlertCircle className="h-3 w-3" />
                    {errors.invoiceDate.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label>{t.invoiceDueDate}</Label>
                <Controller
                  name="dueDate"
                  control={control}
                  render={({ field }) => (
                    <DateInput
                      value={field.value}
                      onChange={field.onChange}
                      disabled={isPending}
                      placeholder={t.invoiceDueDate}
                      className={cn("rounded-xl", errors.dueDate && "border-destructive")}
                    />
                  )}
                />
                {errors.dueDate && (
                  <p className="flex items-center gap-1 text-xs text-destructive">
                    <AlertCircle className="h-3 w-3" />
                    {errors.dueDate.message}
                  </p>
                )}
              </div>
            </div>

            {/* Receive date */}
            <div className="space-y-1.5">
              <Label>{t.invoiceReceiveDate}</Label>
              <Controller
                name="receiveDate"
                control={control}
                render={({ field }) => (
                  <DateInput
                    value={field.value}
                    onChange={field.onChange}
                    disabled={isPending}
                    placeholder={t.invoiceReceiveDate}
                    className={cn("rounded-xl", errors.receiveDate && "border-destructive")}
                  />
                )}
              />
              {errors.receiveDate && (
                <p className="flex items-center gap-1 text-xs text-destructive">
                  <AlertCircle className="h-3 w-3" />
                  {errors.receiveDate.message}
                </p>
              )}
            </div>

            {/* Purchase order */}
            <div className="space-y-1.5">
              <Label>{t.invoicePurchaseOrder}</Label>
              <Controller
                name="purchaseOrderUuid"
                control={control}
                render={({ field }) => (
                  <Combobox
                    value={field.value}
                    onValueChange={field.onChange}
                    options={purchaseOrderOptions}
                    placeholder={t.invoiceSelectPurchaseOrder}
                    disabled={isPending}
                  />
                )}
              />
            </div>

            {/* Signed by */}
            <div className="space-y-1.5">
              <Label>
                {t.invoiceSignedBy}
                {/* <span className="ml-0.5 text-destructive">*</span> */}
              </Label>
              <Controller
                name="signedByUuid"
                control={control}
                render={({ field }) => (
                  <Combobox
                    value={field.value}
                    onValueChange={field.onChange}
                    options={signerOptions}
                    placeholder={t.invoiceSelectSignedBy}
                    disabled={isPending}
                  />
                )}
              />
              {errors.signedByUuid && (
                <p className="flex items-center gap-1 text-xs text-destructive">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  {errors.signedByUuid.message}
                </p>
              )}
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <Label>{t.invoiceDescription}</Label>
              <Textarea
                {...register("description")}
                placeholder={t.invoiceDescriptionPlaceholder}
                rows={3}
                disabled={isPending}
                className="rounded-xl"
              />
            </div>
          </div>

          {/* ── Right panel — items ────────────────────────────────────── */}
          <div className="flex-1 space-y-3 overflow-y-auto px-6 py-5">
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                {t.invoiceItemsSection}
                {fields.length > 0 && (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    {fields.length}
                  </span>
                )}
              </p>
            </div>

            {/* Item sub-form */}
            <ItemForm
              value={itemForm}
              errors={itemErrors}
              medicineOptions={medicineOptions}
              cabinetOptions={cabinetOptions}
              loadingMedicines={loadingMedicines}
              isPending={isPending}
              t={t}
              onChange={setItemForm}
              onClearError={(field) =>
                setItemErrors((prev) => {
                  const next = { ...prev };
                  delete next[field];
                  return next;
                })
              }
              onAdd={handleAddItem}
            />

            {/* Committed items table */}
            <ItemsTable
              items={fields}
              medicines={medicines}
              isPending={isPending}
              t={t}
              onEdit={handleEditItem}
              onRemove={handleRemoveItem}
            />

            {/* Items min-1 validation error */}
            {typeof errors.details?.message === "string" && (
              <p className="flex items-center gap-1 text-xs text-destructive">
                <AlertCircle className="h-3 w-3" />
                {errors.details.message}
              </p>
            )}

            {/* Incomplete PO items warning */}
            {hasIncompleteItems && (
              <p className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                <AlertCircle className="h-3 w-3" />
                {t.invoiceItemsIncompleteWarning}
              </p>
            )}

            {/* Invoice summary */}
            <div className="overflow-hidden rounded-xl border border-border">
              {/* <div className="border-b border-border bg-muted/40 px-4 py-2.5">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {t.invoiceTotalAmount}
                </p>
              </div> */}
              <div className="space-y-2.5 px-4 py-3">
                {/* Subtotal */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t.invoiceSubtotal}</span>
                  <span className="text-sm font-medium text-foreground">{formatCurrencyDecimal(subtotal)}</span>
                </div>

                {/* PPN toggle */}
                <div className="flex items-center justify-between">
                  <Controller
                    name="ppnEnabled"
                    control={control}
                    render={({ field }) => (
                      <button
                        type="button"
                        role="switch"
                        aria-checked={field.value}
                        onClick={() => field.onChange(!field.value)}
                        disabled={isPending}
                        className="flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <span
                          className={cn(
                            "relative inline-flex h-4 w-7 flex-shrink-0 items-center rounded-full transition-colors",
                            field.value ? "bg-primary" : "bg-input"
                          )}
                        >
                          <span
                            className={cn(
                              "inline-block h-3 w-3 rounded-full bg-background shadow-sm transition-transform",
                              field.value ? "translate-x-3.5" : "translate-x-0.5"
                            )}
                          />
                        </span>
                        <span className="text-sm text-muted-foreground">
                          PPN {ppnPercentage}%
                        </span>
                      </button>
                    )}
                  />
                  <span
                    className={cn(
                      "text-sm font-medium",
                      ppnEnabled ? "text-primary" : "text-muted-foreground/40"
                    )}
                  >
                    {ppnEnabled ? `+ ${formatCurrency(ppnAmount)}` : "—"}
                  </span>
                </div>

                {/* Grand Total */}
                <div className="flex items-center justify-between border-t border-border pt-2.5">
                  <span className="text-sm font-semibold text-foreground">{t.invoiceTotalAmount}</span>
                  <span className="text-sm font-bold text-foreground">{formatCurrency(grandTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
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
            type="submit"
            form="invoice-form"
            disabled={isPending || isDataLoading || hasIncompleteItems}
            className="min-w-[9rem] rounded-xl"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t.invoiceSaving}
              </>
            ) : (
              t.invoiceSave
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

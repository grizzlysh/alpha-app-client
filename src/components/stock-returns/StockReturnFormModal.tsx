import type { JSX } from "react";
import { useMemo, useRef, useState } from "react";
import {
  useForm,
  useFieldArray,
  type SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { toast } from "sonner";
import {
  Trash2,
  Loader2,
  Plus,
  Pencil,
  AlertCircle,
  X,
  Undo2,
  Search,
  FileText,
} from "lucide-react";

import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Combobox } from "@/components/ui/combobox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLanguage } from "@/hooks/useLanguage";
import type { Translations } from "@/configs/i18n";
import { getApiErrorMessage } from "@/utils/apiError";
import type {
  StockReturn,
  CreateStockReturnPayload,
  UpdateStockReturnPayload,
} from "@/types/stockReturn";
import type { Invoice, InvoiceDetail } from "@/types/invoice";
import { createStockReturn, updateStockReturn } from "@/service/stockReturnService";
import { getInvoices, getInvoice } from "@/service/invoiceService";
import { getStocks } from "@/service/stockService";
import { getUsers } from "@/service/userService";
import { formatDate } from "./stockReturnUtils";

// ── Edit-mode schema (existing items) ────────────────────────────────────────

function makeEditSchema(t: Translations) {
  return z.object({
    distributorUuid: z.string().min(1, t.srDistributorRequired),
    signedByUuid: z.string().optional(),
    description: z.string().optional(),
    details: z
      .array(
        z.object({
          stockDetailUuid: z.string().min(1, t.srItemBatchRequired),
          quantityPieces: z.number().int().positive(t.srItemQuantityRequired),
        })
      )
      .min(1, t.srItemsRequired),
  });
}

interface EditFormValues {
  distributorUuid: string;
  signedByUuid: string;
  description: string;
  details: { stockDetailUuid: string; quantityPieces: number }[];
}

// ── Edit-mode batch options ───────────────────────────────────────────────────

interface BatchOption {
  value: string;
  label: string;
  quantityPieces: number;
}

// ── Item sub-form for edit mode ───────────────────────────────────────────────

interface EditItemFormState {
  stockDetailUuid: string;
  quantityPieces: string;
}

interface EditItemFormErrors {
  stockDetailUuid?: string;
  quantityPieces?: string;
}

const EMPTY_EDIT_ITEM: EditItemFormState = {
  stockDetailUuid: "",
  quantityPieces: "1",
};

interface EditItemFormProps {
  value: EditItemFormState;
  errors: EditItemFormErrors;
  editingIndex: number | null;
  batchOptions: BatchOption[];
  loadingBatches: boolean;
  isPending: boolean;
  t: Translations;
  onChange: (next: EditItemFormState) => void;
  onAdd: () => void;
  onCancelEdit: () => void;
}

function EditItemForm({
  value,
  errors,
  editingIndex,
  batchOptions,
  loadingBatches,
  isPending,
  t,
  onChange,
  onAdd,
  onCancelEdit,
}: EditItemFormProps): JSX.Element {
  const isEditing = editingIndex !== null;
  return (
    <div
      className={cn(
        "rounded-xl border p-4",
        isEditing ? "border-primary/40 bg-primary/5" : "border-border bg-muted/20"
      )}
    >
      {isEditing && (
        <p className="mb-3 text-xs font-semibold text-primary">
          Editing item #{editingIndex + 1}
        </p>
      )}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">
        <div className="space-y-1 sm:col-span-12">
          <Label className="text-xs">{t.srItemBatch}</Label>
          <Combobox
            value={value.stockDetailUuid}
            onValueChange={(uuid) => onChange({ ...value, stockDetailUuid: uuid })}
            options={batchOptions}
            placeholder={loadingBatches ? `${t.srItemSelectBatch}...` : t.srItemSelectBatch}
            disabled={isPending || loadingBatches}
          />
          {errors.stockDetailUuid && (
            <p className="flex items-center gap-1 text-xs text-destructive">
              <AlertCircle className="h-3 w-3" />
              {errors.stockDetailUuid}
            </p>
          )}
        </div>
        <div className="space-y-1 sm:col-span-6">
          <Label className="text-xs">{t.srItemQuantity}</Label>
          <Input
            type="number"
            min={1}
            value={value.quantityPieces}
            onChange={(e) => onChange({ ...value, quantityPieces: e.target.value })}
            disabled={isPending}
            className={cn("rounded-xl", errors.quantityPieces && "border-destructive")}
          />
          {errors.quantityPieces && (
            <p className="flex items-center gap-1 text-xs text-destructive">
              <AlertCircle className="h-3 w-3 shrink-0" />
              {errors.quantityPieces}
            </p>
          )}
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <Button
          type="button"
          size="sm"
          variant={isEditing ? "default" : "outline"}
          className="h-8 gap-1.5 rounded-xl text-xs"
          disabled={isPending}
          onClick={onAdd}
        >
          {isEditing ? (
            <><Pencil className="h-3.5 w-3.5" />Update Item</>
          ) : (
            <><Plus className="h-3.5 w-3.5" />{t.srItemAdd}</>
          )}
        </Button>
        {isEditing && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="h-3 w-3" />
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}

// ── Edit-mode items table ─────────────────────────────────────────────────────

interface EditItemsTableProps {
  items: EditFormValues["details"];
  batchOptions: BatchOption[];
  editingIndex: number | null;
  isPending: boolean;
  onEdit: (index: number) => void;
  onRemove: (index: number) => void;
}

function EditItemsTable({
  items,
  batchOptions,
  editingIndex,
  isPending,
  onEdit,
  onRemove,
}: EditItemsTableProps): JSX.Element {
  if (items.length === 0) return <></>;
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted">
            <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">#</th>
            <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Batch</th>
            <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Qty</th>
            <th className="w-16 px-3 py-2" />
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {items.map((item, index) => {
            const batch = batchOptions.find((b) => b.value === item.stockDetailUuid);
            const isActive = editingIndex === index;
            return (
              <tr
                key={index}
                className={cn("transition-colors", isActive ? "bg-primary/5" : "hover:bg-accent/40")}
              >
                <td className="px-3 py-2.5 text-xs text-muted-foreground">{index + 1}</td>
                <td className="max-w-[200px] px-3 py-2.5">
                  <span className="truncate font-medium text-foreground">
                    {batch?.label ?? item.stockDetailUuid}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-foreground">{item.quantityPieces}</td>
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
          })}
        </tbody>
      </table>
    </div>
  );
}

// ── Create-mode invoice item row ──────────────────────────────────────────────

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

interface InvoiceItemRowProps {
  detail: InvoiceDetail;
  availableBoxes: number | null;
  checked: boolean;
  qty: string;
  reason: string;
  isPending: boolean;
  noStock: boolean;
  noStockMessage?: string;
  t: Translations;
  onCheck: (checked: boolean) => void;
  onQtyChange: (qty: string) => void;
  onReasonChange: (reason: string) => void;
}

function InvoiceItemRow({
  detail,
  availableBoxes,
  checked,
  qty,
  reason,
  isPending,
  noStock,
  noStockMessage,
  t,
  onCheck,
  onQtyChange,
  onReasonChange,
}: InvoiceItemRowProps): JSX.Element {
  const returnBoxes = Number(qty);
  const estimatedReturn =
    checked && !isNaN(returnBoxes) && returnBoxes > 0
      ? returnBoxes * detail.finalPrice
      : null;

  function handleQtyChange(raw: string): void {
    const val = Math.max(1, parseInt(raw, 10) || 1);
    const capped = availableBoxes !== null ? Math.min(val, availableBoxes) : val;
    onQtyChange(String(capped));
  }

  return (
    <div
      className={cn(
        "rounded-xl border p-3 transition-colors",
        checked
          ? "border-primary/40 bg-primary/5"
          : noStock
          ? "border-border bg-muted/10 opacity-50"
          : "border-border bg-muted/10"
      )}
    >
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onCheck(e.target.checked)}
          disabled={isPending || noStock}
          className="mt-1 h-4 w-4 shrink-0 accent-primary"
        />

        <div className="min-w-0 flex-1 space-y-1.5">
          {/* Medicine name + batch */}
          <div>
            <p className="truncate font-medium uppercase text-foreground">{detail.medicine.name}</p>
            <p className="text-xs text-muted-foreground">
              {t.srBatchLabel}: <span className="font-mono uppercase">{detail.batchNumber}</span>
              {" · "}
              {t.srExpiryLabel}: {formatDate(detail.expiryDate)}
            </p>
          </div>

          {/* Price info row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-0.5 text-xs text-muted-foreground">
            <span>
              {t.srPricePerBox}:{" "}
              <span className="font-medium text-foreground">
                {formatCurrency(detail.price)}
              </span>
            </span>
            {detail.discountPercentage > 0 && (
              <span>
                {t.srDiscountLabel}:{" "}
                <span className="font-medium text-amber-600 dark:text-amber-400">
                  {detail.discountPercentage}%
                  {" ("}
                  {formatCurrency(detail.finalPrice)}/box
                  {")"}
                </span>
              </span>
            )}
            {availableBoxes !== null && (
              <span>
                {t.srItemAvailable}:{" "}
                <span className="font-medium text-foreground">
                  {availableBoxes} box
                </span>
              </span>
            )}
          </div>

          {/* No stock warning */}
          {noStock && noStockMessage && (
            <p className="flex items-center gap-1 text-xs text-destructive">
              <AlertCircle className="h-3 w-3" />
              {noStockMessage}
            </p>
          )}

          {/* Per-row estimated return */}
          {estimatedReturn !== null && (
            <p className="text-xs font-medium text-primary">
              {t.srEstimatedReturn}:{" "}
              {formatCurrency(estimatedReturn)}
            </p>
          )}
        </div>

        {/* Return qty box input */}
        {checked && (
          <div className="w-28 shrink-0">
            <Label className="mb-1 block text-xs text-muted-foreground">
              {t.srReturnQtyBox}
            </Label>
            <Input
              type="number"
              min={1}
              max={availableBoxes ?? undefined}
              value={qty}
              onChange={(e) => handleQtyChange(e.target.value)}
              disabled={isPending}
              className="h-8 rounded-lg text-center text-sm"
            />
          </div>
        )}
      </div>

      {/* Per-item reason (optional, shown when checked) */}
      {checked && (
        <div className="mt-2.5 space-y-1">
          <Label className="text-xs text-muted-foreground">
            {t.srReason}
            <span className="ml-1 text-muted-foreground/50">(optional)</span>
          </Label>
          <Input
            value={reason}
            onChange={(e) => onReasonChange(e.target.value)}
            placeholder={t.srReasonPlaceholder}
            disabled={isPending}
            className="h-8 rounded-lg text-sm"
          />
        </div>
      )}
    </div>
  );
}

// ── Props ─────────────────────────────────────────────────────────────────────

export interface StockReturnPrefillDetail {
  stockDetailUuid: string;
  quantityPieces: number;
  distributorUuid?: string;
}

export interface StockReturnFormModalProps {
  mode: "create" | "edit";
  stockReturn?: StockReturn;
  prefillDetail?: StockReturnPrefillDetail;
  onClose: () => void;
  onSuccess: (stockReturn: StockReturn) => void;
}

// ── Main component ────────────────────────────────────────────────────────────

export function StockReturnFormModal({
  mode,
  stockReturn,
  prefillDetail,
  onClose,
  onSuccess,
}: StockReturnFormModalProps): JSX.Element {
  const queryClient = useQueryClient();
  const { t, language } = useLanguage();
  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  // ── Shared state ───────────────────────────────────────────────────────────
  const [signedByUuid, setSignedByUuid] = useState(stockReturn?.signedBy?.uuid ?? "");
  const [description, setDescription] = useState(stockReturn?.description ?? "");

  // ── Create mode: invoice state ─────────────────────────────────────────────
  const [invoiceSearch, setInvoiceSearch] = useState("");
  const [debouncedInvoiceSearch] = useDebounce(invoiceSearch, 400);
  const [selectedInvoiceUuid, setSelectedInvoiceUuid] = useState("");
  const [invoiceError, setInvoiceError] = useState("");
  const [itemsError, setItemsError] = useState("");
  // key: invoiceDetail.batchNumber
  const [itemSelections, setItemSelections] = useState<
    Record<string, { checked: boolean; qty: string; reason: string }>
  >({});

  // ── Edit mode: item sub-form state ─────────────────────────────────────────
  const [editItemForm, setEditItemForm] = useState<EditItemFormState>(EMPTY_EDIT_ITEM);
  const [editItemErrors, setEditItemErrors] = useState<EditItemFormErrors>({});
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // ── Edit mode: react-hook-form ─────────────────────────────────────────────
  const editSchema = useMemo(() => makeEditSchema(t), [t]);
  const {
    control: editControl,
    handleSubmit: handleEditSubmit,
    formState: { errors: editErrors },
  } = useForm<EditFormValues>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      distributorUuid: stockReturn?.distributor.uuid ?? prefillDetail?.distributorUuid ?? "",
      signedByUuid: "",
      description: "",
      details:
        stockReturn?.details.map((d) => ({
          stockDetailUuid: d.stockDetail.uuid,
          quantityPieces: d.quantityPieces,
        })) ??
        (prefillDetail
          ? [{ stockDetailUuid: prefillDetail.stockDetailUuid, quantityPieces: prefillDetail.quantityPieces }]
          : []),
    },
  });
  const { fields, append, update, remove } = useFieldArray({
    control: editControl,
    name: "details",
  });

  // ── Remote data ────────────────────────────────────────────────────────────
  const { data: invoiceSearchData, isLoading: searchingInvoices } = useQuery({
    queryKey: ["invoices-search-for-return", debouncedInvoiceSearch],
    queryFn: () => getInvoices({ search: debouncedInvoiceSearch, limit: 10 }),
    enabled: debouncedInvoiceSearch.length >= 2 && mode === "create",
    staleTime: 0,
  });

  const { data: selectedInvoiceData } = useQuery({
    queryKey: ["invoice-for-return", selectedInvoiceUuid],
    queryFn: () => getInvoice(selectedInvoiceUuid),
    enabled: !!selectedInvoiceUuid,
    staleTime: 0,
  });
  const selectedInvoice: Invoice | null = selectedInvoiceData?.data ?? null;

  const { data: stocksData, isLoading: loadingBatches } = useQuery({
    queryKey: ["stocks-for-return"],
    queryFn: () => getStocks({ limit: 500, sortBy: "name", sortOrder: "asc" }),
    enabled: mode === "edit",
    staleTime: 0,
  });

  const { data: usersData } = useQuery({
    queryKey: ["users-all"],
    queryFn: () => getUsers({ limit: 100 }),
    staleTime: 5 * 60 * 1000,
  });

  const batchOptions = useMemo<BatchOption[]>(
    () =>
      (stocksData?.data ?? []).flatMap((stock) =>
        stock.details.map((d) => ({
          value: d.uuid,
          label: `${stock.medicine.name.toUpperCase()} · ${d.batchNumber.toUpperCase()} (${d.quantityPieces} ${stock.medicine.unit}, exp: ${formatDate(d.expiryDate)})`,
          quantityPieces: d.quantityPieces,
        }))
      ),
    [stocksData?.data]
  );

  const signerOptions = useMemo(
    () => [
      { value: "", label: t.srSelectSignedBy },
      ...(usersData?.data ?? []).map((u) => ({ value: u.uuid, label: u.name })),
    ],
    [usersData?.data, t.srSelectSignedBy]
  );

  const invoiceSearchResults = invoiceSearchData?.data ?? [];
  const showInvoiceDropdown =
    debouncedInvoiceSearch.length >= 2 && !selectedInvoiceUuid && invoiceSearchResults.length > 0;

  // ── Helpers ────────────────────────────────────────────────────────────────

  function toggleItem(batchNumber: string, checked: boolean, maxBoxes: number): void {
    setItemSelections((prev) => ({
      ...prev,
      [batchNumber]: { checked, qty: prev[batchNumber]?.qty ?? String(maxBoxes), reason: prev[batchNumber]?.reason ?? "" },
    }));
    setItemsError("");
  }

  function updateItemQty(batchNumber: string, qty: string): void {
    setItemSelections((prev) => ({
      ...prev,
      [batchNumber]: { ...prev[batchNumber], checked: true, qty },
    }));
  }

  function updateItemReason(batchNumber: string, reason: string): void {
    setItemSelections((prev) => ({
      ...prev,
      [batchNumber]: { ...prev[batchNumber], reason },
    }));
  }

  function selectInvoice(invoice: Invoice): void {
    setSelectedInvoiceUuid(invoice.uuid);
    setInvoiceSearch("");
    setInvoiceError("");
    setItemSelections({});
  }

  function clearInvoice(): void {
    setSelectedInvoiceUuid("");
    setInvoiceSearch("");
    setInvoiceError("");
    setItemSelections({});
  }

  // ── Edit-mode item handlers ────────────────────────────────────────────────

  function validateEditItem(): boolean {
    const errs: EditItemFormErrors = {};
    if (!editItemForm.stockDetailUuid) errs.stockDetailUuid = t.srItemBatchRequired;
    const qty = Number(editItemForm.quantityPieces);
    if (!editItemForm.quantityPieces || isNaN(qty) || qty < 1 || !Number.isInteger(qty)) {
      errs.quantityPieces = t.srItemQuantityRequired;
    }
    setEditItemErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleAddOrUpdateEditItem(): void {
    if (!validateEditItem()) return;
    const committed = {
      stockDetailUuid: editItemForm.stockDetailUuid,
      quantityPieces: Number(editItemForm.quantityPieces),
    };
    if (editingIndex !== null) {
      update(editingIndex, committed);
      setEditingIndex(null);
    } else {
      append(committed);
    }
    setEditItemForm(EMPTY_EDIT_ITEM);
    setEditItemErrors({});
  }

  function handleEditItem(index: number): void {
    const item = fields[index];
    setEditItemForm({
      stockDetailUuid: item.stockDetailUuid,
      quantityPieces: String(item.quantityPieces),
    });
    setEditingIndex(index);
    setEditItemErrors({});
  }

  function handleRemoveItem(index: number): void {
    remove(index);
    if (editingIndex === index) {
      setEditingIndex(null);
      setEditItemForm(EMPTY_EDIT_ITEM);
      setEditItemErrors({});
    } else if (editingIndex !== null && index < editingIndex) {
      setEditingIndex(editingIndex - 1);
    }
  }

  function handleCancelEdit(): void {
    setEditingIndex(null);
    setEditItemForm(EMPTY_EDIT_ITEM);
    setEditItemErrors({});
  }

  // ── Mutation ───────────────────────────────────────────────────────────────
  const mutation = useMutation({
    mutationFn: (
      payload: CreateStockReturnPayload | UpdateStockReturnPayload
    ) => {
      if (mode === "create") {
        return createStockReturn(payload as CreateStockReturnPayload);
      }
      return updateStockReturn(stockReturn!.uuid, payload as UpdateStockReturnPayload);
    },
    onSuccess: (res) => {
      if (res.success && res.data) {
        queryClient.invalidateQueries({ queryKey: ["stock-returns"] });
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

  // ── Create-mode submit ─────────────────────────────────────────────────────
  function handleCreateSubmit(e: React.FormEvent): void {
    e.preventDefault();

    let valid = true;

    if (!selectedInvoice) {
      setInvoiceError(t.srInvoiceRequired);
      valid = false;
    }

    const checkedDetails =
      selectedInvoice?.details.filter(
        (d) => itemSelections[d.batchNumber]?.checked
      ) ?? [];

    if (valid && checkedDetails.length === 0) {
      setItemsError(t.srItemsCheckedRequired);
      valid = false;
    }

    if (!valid) return;

    const details: CreateStockReturnPayload["details"] = [];
    for (const detail of checkedDetails) {
      const returnBoxes = Number(itemSelections[detail.batchNumber]?.qty);
      if (!returnBoxes || returnBoxes < 1 || !Number.isInteger(returnBoxes)) {
        toast.error(t.srItemQuantityRequired);
        return;
      }
      if (!detail.stockDetail) {
        toast.error(t.srItemNoStock);
        return;
      }
      const quantityPieces = returnBoxes * detail.quantityPerBox;
      const itemReason = itemSelections[detail.batchNumber]?.reason ?? "";
      details.push({
        stockDetailUuid: detail.stockDetail.uuid,
        quantityPieces,
        ...(itemReason ? { reason: itemReason } : {}),
      });
    }

    const payload: CreateStockReturnPayload = {
      distributorUuid: selectedInvoice!.distributor.uuid,
      ...(signedByUuid ? { signedByUuid } : {}),
      ...(description ? { description } : {}),
      details,
    };
    mutation.mutate(payload);
  }

  // ── Edit-mode submit ───────────────────────────────────────────────────────
  const onEditSubmit: SubmitHandler<EditFormValues> = (values) => {
    const details = values.details.map((d) => ({
      stockDetailUuid: d.stockDetailUuid,
      quantityPieces: d.quantityPieces,
    }));
    const payload: UpdateStockReturnPayload = {
      distributorUuid: values.distributorUuid,
      ...(signedByUuid ? { signedByUuid } : {}),
      ...(description !== undefined ? { description } : {}),
      details,
    };
    mutation.mutate(payload);
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  const rightPanel = (
    <div className="flex flex-col gap-5">
      <div className="space-y-1.5">
        <Label>{t.srSignedBy}</Label>
        <Combobox
          value={signedByUuid}
          onValueChange={setSignedByUuid}
          options={signerOptions}
          placeholder={t.srSelectSignedBy}
          disabled={isPending}
        />
      </div>
      <div className="space-y-1.5">
        <Label>{t.srDescription}</Label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t.srDescriptionPlaceholder}
          rows={3}
          disabled={isPending}
          className="rounded-xl"
        />
      </div>
    </div>
  );

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !isPending) onClose();
      }}
    >
      <DialogContent
        className="flex h-[90vh] max-w-5xl flex-col gap-0 p-0"
        onInteractOutside={(e) => {
          if (isPending) e.preventDefault();
        }}
      >
        <DialogHeader className="flex flex-row items-center gap-3 space-y-0 border-b border-border px-6 py-4">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <Undo2 className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <DialogTitle className="text-base">
              {mode === "create" ? t.srAdd : t.srEdit}
            </DialogTitle>
            {mode === "edit" && stockReturn && (
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {stockReturn.returnNumber}
              </p>
            )}
          </div>
        </DialogHeader>

        {/* ── CREATE MODE ────────────────────────────────────────────────── */}
        {mode === "create" && (
          <form
            id="sr-create-form"
            onSubmit={handleCreateSubmit}
            className="flex-1 min-h-0 overflow-hidden"
          >
            <div className="grid h-full grid-cols-[1fr,320px]">

              {/* Left — invoice + items */}
              <div className="flex flex-col overflow-hidden border-r border-border">

                {/* ── Invoice header (always visible) ── */}
                <div className="shrink-0 space-y-1.5 border-b border-border px-6 py-4">
                  <Label>
                    {t.srInvoice}
                    <span className="ml-1 text-destructive">*</span>
                  </Label>

                  {selectedInvoice ? (
                    <div className="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3">
                      <FileText className="h-5 w-5 shrink-0 text-primary" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium uppercase text-foreground">
                          {selectedInvoice.invoiceNumber}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          <span className="uppercase">{selectedInvoice.distributor.name}</span>
                          {" · "}
                          {formatDate(selectedInvoice.invoiceDate)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={clearInvoice}
                        disabled={isPending}
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          value={invoiceSearch}
                          onChange={(e) => setInvoiceSearch(e.target.value)}
                          placeholder={t.srSearchInvoice}
                          disabled={isPending}
                          className="rounded-xl pl-9"
                        />
                        {searchingInvoices && (
                          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
                        )}
                      </div>
                      {showInvoiceDropdown && (
                        <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-xl border border-border bg-card shadow-lg">
                          {invoiceSearchResults.map((inv) => (
                            <button
                              key={inv.uuid}
                              type="button"
                              onClick={() => selectInvoice(inv)}
                              className="w-full px-4 py-3 text-left transition-colors hover:bg-accent"
                            >
                              <p className="text-sm font-medium uppercase text-foreground">
                                {inv.invoiceNumber}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                <span className="uppercase">{inv.distributor.name}</span>
                                {" · "}
                                {formatDate(inv.invoiceDate)}
                              </p>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {invoiceError && (
                    <p className="flex items-center gap-1 text-xs text-destructive">
                      <AlertCircle className="h-3 w-3" />
                      {invoiceError}
                    </p>
                  )}
                </div>

                {/* ── Scrollable items body ── */}
                <div className="flex-1 overflow-y-auto px-6 py-5">
                  {selectedInvoice ? (
                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-foreground">
                        {t.srInvoiceItems}
                        <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                          {selectedInvoice.details.length}
                        </span>
                      </p>
                      <div className="space-y-2">
                        {selectedInvoice.details.map((detail, idx) => {
                          const stockDetail = detail.stockDetail;
                          const availableBoxes = stockDetail
                            ? Math.floor(stockDetail.quantityPieces / detail.quantityPerBox)
                            : null;
                          const sel = itemSelections[detail.batchNumber];
                          const isNoStockDetail = !stockDetail;
                          const isOutOfStock = !!stockDetail && (availableBoxes ?? 0) <= 0;
                          const noStock = isNoStockDetail || isOutOfStock;
                          const noStockMessage = isNoStockDetail
                            ? t.srItemNoStock
                            : isOutOfStock
                            ? t.srItemOutOfStock
                            : undefined;
                          return (
                            <InvoiceItemRow
                              key={idx}
                              detail={detail}
                              availableBoxes={availableBoxes}
                              checked={sel?.checked ?? false}
                              qty={sel?.qty ?? String(availableBoxes ?? 1)}
                              reason={sel?.reason ?? ""}
                              isPending={isPending}
                              noStock={noStock}
                              noStockMessage={noStockMessage}
                              t={t}
                              onCheck={(checked) =>
                                toggleItem(detail.batchNumber, checked, availableBoxes ?? 1)
                              }
                              onQtyChange={(qty) => updateItemQty(detail.batchNumber, qty)}
                              onReasonChange={(reason) => updateItemReason(detail.batchNumber, reason)}
                            />
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border bg-muted/20 px-4 py-10 text-center">
                      <FileText className="h-8 w-8 text-muted-foreground/40" />
                      <p className="text-sm text-muted-foreground">{t.srNoInvoiceSelected}</p>
                    </div>
                  )}
                </div>

                {/* ── Total / error footer (always visible) ── */}
                {selectedInvoice && (() => {
                  const total = selectedInvoice.details.reduce((sum, detail) => {
                    const sel = itemSelections[detail.batchNumber];
                    if (!sel?.checked) return sum;
                    const returnBoxes = Number(sel.qty);
                    if (!returnBoxes || returnBoxes <= 0) return sum;
                    return sum + returnBoxes * detail.finalPrice;
                  }, 0);
                  if (total <= 0 && !itemsError) return null;
                  return (
                    <div className="shrink-0 space-y-2 border-t border-border px-6 py-4">
                      {total > 0 && (
                        <div className="flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 px-4 py-2.5">
                          <span className="text-sm font-medium text-muted-foreground">
                            {t.srTotalEstimated}
                          </span>
                          <span className="text-base font-semibold text-primary">
                            {new Intl.NumberFormat("id-ID", {
                              style: "currency",
                              currency: "IDR",
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            }).format(total)}
                          </span>
                        </div>
                      )}
                      {itemsError && (
                        <p className="flex items-center gap-1 text-xs text-destructive">
                          <AlertCircle className="h-3 w-3" />
                          {itemsError}
                        </p>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Right — signed by + notes */}
              <div className="overflow-y-auto px-6 py-5">
                {rightPanel}
              </div>
            </div>
          </form>
        )}

        {/* ── EDIT MODE ──────────────────────────────────────────────────── */}
        {mode === "edit" && (
          <form
            id="sr-edit-form"
            onSubmit={handleEditSubmit(onEditSubmit)}
            className="flex-1 min-h-0 overflow-hidden"
          >
            <div className="grid h-full grid-cols-[1fr,320px]">

              {/* Left — items */}
              <div className="overflow-y-auto border-r border-border px-6 py-5 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground">
                    {t.srItemsSection}
                    {fields.length > 0 && (
                      <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        {fields.length}
                      </span>
                    )}
                  </p>
                </div>

                <EditItemForm
                  value={editItemForm}
                  errors={editItemErrors}
                  editingIndex={editingIndex}
                  batchOptions={batchOptions}
                  loadingBatches={loadingBatches}
                  isPending={isPending}
                  t={t}
                  onChange={setEditItemForm}
                  onAdd={handleAddOrUpdateEditItem}
                  onCancelEdit={handleCancelEdit}
                />

                <EditItemsTable
                  items={fields}
                  batchOptions={batchOptions}
                  editingIndex={editingIndex}
                  isPending={isPending}
                  onEdit={handleEditItem}
                  onRemove={handleRemoveItem}
                />

                {typeof editErrors.details?.message === "string" && (
                  <p className="flex items-center gap-1 text-xs text-destructive">
                    <AlertCircle className="h-3 w-3" />
                    {editErrors.details.message}
                  </p>
                )}
              </div>

              {/* Right — signed by + notes */}
              <div className="overflow-y-auto px-6 py-5">
                {rightPanel}
              </div>
            </div>
          </form>
        )}

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
            form={mode === "create" ? "sr-create-form" : "sr-edit-form"}
            disabled={isPending || (mode === "edit" && loadingBatches)}
            className="min-w-[9rem] rounded-xl"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t.srSaving}
              </>
            ) : (
              t.srSave
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

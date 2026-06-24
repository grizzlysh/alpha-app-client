import type { JSX } from "react";
import { useMemo, useRef, useState } from "react";
import {
  useForm,
  useFieldArray,
  Controller,
  type SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { toast } from "sonner";
import {
  ArchiveX,
  Trash2,
  Loader2,
  Plus,
  Pencil,
  AlertCircle,
  X,
  Search,
  FlaskConical,
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
  StockDisposal,
  DisposalReason,
  CreateStockDisposalPayload,
  UpdateStockDisposalPayload,
} from "@/types/stockDisposal";
import type { StockDetailSearchResult } from "@/types/stock";
import {
  createStockDisposal,
  updateStockDisposal,
} from "@/service/stockDisposalService";
import { getStockDetails } from "@/service/stockService";
import { getUsers } from "@/service/userService";
import { formatDate } from "./stockDisposalUtils";

// ── Schema ────────────────────────────────────────────────────────────────────

function makeSchema(t: Translations) {
  return z.object({
    signedByUuid: z.string().optional(),
    description: z.string().optional(),
    details: z
      .array(
        z.object({
          stockDetailUuid: z.string().min(1, t.sdItemBatchRequired),
          quantityPieces: z.number().int().positive(t.sdItemQuantityRequired),
          reason: z.enum(["EXPIRED", "DAMAGED", "CONTAMINATED"], {
            errorMap: () => ({ message: t.sdItemReasonRequired }),
          }),
        })
      )
      .min(1, t.sdItemsRequired),
  });
}

interface FormValues {
  signedByUuid: string;
  description: string;
  details: {
    stockDetailUuid: string;
    quantityPieces: number;
    reason: DisposalReason;
  }[];
}

// ── Committed item (carries display labels) ───────────────────────────────────

interface CommittedItem {
  stockDetailUuid: string;
  quantityPieces: number;
  reason: DisposalReason;
  medicineName: string;
  unit: string;
  batchNumber: string;
  expiryDate: string;
  detail: StockDetailSearchResult;
}

interface ItemFormErrors {
  quantityPieces?: string;
  reason?: string;
}

// ── Props ─────────────────────────────────────────────────────────────────────

export interface StockDisposalPrefillDetail {
  stockDetailUuid: string;
  quantityPieces: number;
}

export interface StockDisposalFormModalProps {
  mode: "create" | "edit";
  disposal?: StockDisposal;
  prefillDetail?: StockDisposalPrefillDetail;
  onClose: () => void;
  onSuccess: (disposal: StockDisposal) => void;
}

// ── Main component ────────────────────────────────────────────────────────────

export function StockDisposalFormModal({
  mode,
  disposal,
  onClose,
  onSuccess,
}: StockDisposalFormModalProps): JSX.Element {
  const queryClient = useQueryClient();
  const { t, language } = useLanguage();
  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  // ── Search state ───────────────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 300);
  const [selectedDetail, setSelectedDetail] = useState<StockDetailSearchResult | null>(null);

  // ── Item add form state ────────────────────────────────────────────────────
  const [qty, setQty] = useState("1");
  const [reason, setReason] = useState<DisposalReason | "">("");
  const [itemErrors, setItemErrors] = useState<ItemFormErrors>({});

  // ── react-hook-form ────────────────────────────────────────────────────────
  const schema = useMemo(() => makeSchema(t), [t]);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      signedByUuid: disposal?.signedByUser?.uuid ?? "",
      description: disposal?.description ?? "",
      details:
        disposal?.details.map((d) => ({
          stockDetailUuid: d.stockDetail.uuid,
          quantityPieces: d.quantityPieces,
          reason: d.reason,
        })) ?? [],
    },
  });
  const { append, remove } = useFieldArray({
    control,
    name: "details",
  });

  const [committedDisplay, setCommittedDisplay] = useState<CommittedItem[]>(
    () =>
      disposal?.details.map((d) => ({
        stockDetailUuid: d.stockDetail.uuid,
        quantityPieces: d.quantityPieces,
        reason: d.reason,
        medicineName: d.medicine.name,
        unit: d.medicine.unit,
        batchNumber: d.stockDetail.batchNumber,
        expiryDate: d.stockDetail.expiryDate,
        detail: {
          uuid: d.stockDetail.uuid,
          barcode: null,
          batchNumber: d.stockDetail.batchNumber,
          expiryDate: d.stockDetail.expiryDate,
          quantityPieces: d.quantityPieces,
          quantityBox: 0,
          quantityPerBox: 0,
          distributor: { uuid: "", name: "" },
          stock: { uuid: "", effectiveSellingPrice: 0 },
          medicine: {
            uuid: d.medicine.uuid,
            name: d.medicine.name,
            unit: d.medicine.unit,
            shape: { name: "" },
            type: { name: "" },
          },
        },
      })) ?? []
  );

  // ── Remote data ────────────────────────────────────────────────────────────
  const { data: searchData, isFetching: searchFetching } = useQuery({
    queryKey: ["stock-details-search", debouncedSearch],
    queryFn: () => getStockDetails({ search: debouncedSearch }),
    enabled: debouncedSearch.length >= 2 && !selectedDetail,
    staleTime: 0,
  });

  const { data: usersData } = useQuery({
    queryKey: ["users-all"],
    queryFn: () => getUsers({ limit: 100 }),
    staleTime: 5 * 60 * 1000,
  });

  // ── Derived ────────────────────────────────────────────────────────────────
  const searchResults = searchData?.data ?? [];

  const showDropdown =
    debouncedSearch.length >= 2 &&
    !selectedDetail &&
    searchResults.length > 0;

  const reasonOptions = useMemo(
    () => [
      { value: "EXPIRED", label: t.sdReasonExpired },
      { value: "DAMAGED", label: t.sdReasonDamaged },
      { value: "CONTAMINATED", label: t.sdReasonContaminated },
    ],
    [t.sdReasonExpired, t.sdReasonDamaged, t.sdReasonContaminated]
  );

  const signerOptions = useMemo(
    () => [
      { value: "", label: t.sdSelectSignedBy },
      ...(usersData?.data ?? []).map((u) => ({ value: u.uuid, label: u.name })),
    ],
    [usersData?.data, t.sdSelectSignedBy]
  );

  const isAddFormVisible = selectedDetail !== null;

  // ── Handlers ───────────────────────────────────────────────────────────────

  function selectDetail(detail: StockDetailSearchResult): void {
    setSelectedDetail(detail);
    setSearch("");
    setItemErrors({});
  }

  function clearDetail(): void {
    setSelectedDetail(null);
    setSearch("");
    setQty("1");
    setReason("");
    setItemErrors({});
  }

  function handleSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>): void {
    if (e.key !== "Enter") return;
    e.preventDefault();
    if (searchResults.length === 1) {
      selectDetail(searchResults[0]);
      return;
    }
    const trimmed = search.trim();
    if (!trimmed) return;
    const exact = searchResults.find(
      (r) => r.barcode === trimmed || r.batchNumber === trimmed
    );
    if (exact) selectDetail(exact);
  }

  function validateItemForm(): boolean {
    const errs: ItemFormErrors = {};
    const qtyNum = Number(qty);
    if (!qty || isNaN(qtyNum) || qtyNum < 1 || !Number.isInteger(qtyNum)) {
      errs.quantityPieces = t.sdItemQuantityRequired;
    }
    if (!reason) errs.reason = t.sdItemReasonRequired;
    setItemErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleAddItem(): void {
    if (!selectedDetail || !validateItemForm()) return;
    const committed: CommittedItem = {
      stockDetailUuid: selectedDetail.uuid,
      quantityPieces: Number(qty),
      reason: reason as DisposalReason,
      medicineName: selectedDetail.medicine.name,
      unit: selectedDetail.medicine.unit,
      batchNumber: selectedDetail.batchNumber,
      expiryDate: selectedDetail.expiryDate,
      detail: selectedDetail,
    };
    append({
      stockDetailUuid: committed.stockDetailUuid,
      quantityPieces: committed.quantityPieces,
      reason: committed.reason,
    });
    setCommittedDisplay((prev) => [...prev, committed]);
    setSelectedDetail(null);
    setQty("1");
    setReason("");
    setItemErrors({});
  }

  function handleEditItem(index: number): void {
    const item = committedDisplay[index];
    if (!item) return;
    remove(index);
    setCommittedDisplay((prev) => prev.filter((_, i) => i !== index));
    setSelectedDetail(item.detail);
    setQty(String(item.quantityPieces));
    setReason(item.reason);
    setItemErrors({});
  }

  function handleRemoveItem(index: number): void {
    remove(index);
    setCommittedDisplay((prev) => prev.filter((_, i) => i !== index));
  }

  // ── Mutation ───────────────────────────────────────────────────────────────
  const mutation = useMutation({
    mutationFn: (values: FormValues) => {
      const details = values.details.map((d) => ({
        stockDetailUuid: d.stockDetailUuid,
        quantityPieces: d.quantityPieces,
        reason: d.reason,
      }));
      if (mode === "create") {
        const payload: CreateStockDisposalPayload = {
          ...(values.signedByUuid ? { signedByUuid: values.signedByUuid } : {}),
          ...(values.description ? { description: values.description } : {}),
          details,
        };
        return createStockDisposal(payload);
      }
      const payload: UpdateStockDisposalPayload = {
        ...(values.signedByUuid ? { signedByUuid: values.signedByUuid } : {}),
        ...(values.description !== undefined ? { description: values.description } : {}),
        details,
      };
      return updateStockDisposal(disposal!.uuid, payload);
    },
    onSuccess: (res) => {
      if (res.success && res.data) {
        queryClient.invalidateQueries({ queryKey: ["stock-disposals"] });
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
  const onSubmit: SubmitHandler<FormValues> = (values) => mutation.mutate(values);

  // ── Render ─────────────────────────────────────────────────────────────────
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
            <ArchiveX className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <DialogTitle className="text-base">
              {mode === "create" ? t.sdAdd : t.sdEdit}
            </DialogTitle>
            {mode === "edit" && disposal && (
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {disposal.disposalNumber}
              </p>
            )}
          </div>
        </DialogHeader>

        <form
          id="sd-form"
          onSubmit={handleSubmit(onSubmit)}
          className="min-h-0 flex-1 overflow-hidden"
        >
          <div className="grid h-full grid-cols-[1fr,320px]">

            {/* ── LEFT: search + items ──────────────────────────────── */}
            <div className="flex flex-col overflow-hidden border-r border-border">

              {/* Sticky search header */}
              <div className="shrink-0 space-y-1.5 border-b border-border px-6 py-4">
                <Label>{t.sdBarcodeOrBatch}</Label>

                {selectedDetail ? (
                  /* Selected detail card */
                  <div className="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3">
                    <FlaskConical className="h-5 w-5 shrink-0 text-primary" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium uppercase text-foreground">
                        {selectedDetail.medicine.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t.sdBatchLabel}: <span className="uppercase">{selectedDetail.batchNumber}</span>
                        {" · "}
                        {selectedDetail.quantityPieces} {selectedDetail.medicine.unit}
                        {" · "}
                        {t.sdExpiryLabel}: {formatDate(selectedDetail.expiryDate)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={clearDetail}
                      disabled={isPending}
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  /* Search input */
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      onKeyDown={handleSearchKeyDown}
                      placeholder={t.sdBarcodePlaceholder}
                      disabled={isPending}
                      className="rounded-xl pl-9"
                      autoComplete="off"
                    />
                    {searchFetching && (
                      <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
                    )}

                    {showDropdown && (
                      <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-y-auto rounded-xl border border-border bg-card shadow-lg">
                        {searchResults.map((detail) => (
                          <button
                            key={detail.uuid}
                            type="button"
                            onClick={() => selectDetail(detail)}
                            className="w-full px-4 py-3 text-left transition-colors hover:bg-accent"
                          >
                            <p className="text-sm font-medium uppercase text-foreground">
                              {detail.medicine.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {t.sdBatchLabel}: <span className="uppercase">{detail.batchNumber}</span>
                              {" · "}
                              {detail.quantityPieces} {detail.medicine.unit}
                              {" · "}
                              {t.sdExpiryLabel}: {formatDate(detail.expiryDate)}
                            </p>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Scrollable body */}
              <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">

                {/* Add form — always visible */}
                <div className="space-y-3 rounded-xl border border-border bg-muted/20 p-4">
                  <div className="grid grid-cols-12 gap-3">
                    {/* Quantity */}
                    <div className="col-span-4 space-y-1">
                      <Label className="text-xs">{t.sdItemQuantity}</Label>
                      <Input
                        type="number"
                        min={1}
                        value={qty}
                        onChange={(e) => setQty(e.target.value.replace(/^0+(?=\d)/, ""))}
                        disabled={isPending || !isAddFormVisible}
                        className={cn(
                          "rounded-xl",
                          itemErrors.quantityPieces && "border-destructive"
                        )}
                      />
                      {itemErrors.quantityPieces && (
                        <p className="flex items-center gap-1 text-xs text-destructive">
                          <AlertCircle className="h-3 w-3 shrink-0" />
                          {itemErrors.quantityPieces}
                        </p>
                      )}
                    </div>

                    {/* Reason */}
                    <div className="col-span-8 space-y-1">
                      <Label className="text-xs">{t.sdItemReason}</Label>
                      <Combobox
                        value={reason}
                        onValueChange={(r) => setReason(r as DisposalReason)}
                        options={reasonOptions}
                        placeholder={t.sdItemSelectReason}
                        disabled={isPending || !isAddFormVisible}
                      />
                      {itemErrors.reason && (
                        <p className="flex items-center gap-1 text-xs text-destructive">
                          <AlertCircle className="h-3 w-3 shrink-0" />
                          {itemErrors.reason}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-1">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="h-8 gap-1.5 rounded-xl text-xs"
                      disabled={isPending || !isAddFormVisible}
                      onClick={handleAddItem}
                    >
                      <Plus className="h-3.5 w-3.5" />
                      {t.sdItemAdd}
                    </Button>
                  </div>
                </div>

                {/* Committed items */}
                {committedDisplay.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-foreground">
                      {t.sdItemsSection}
                      <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        {committedDisplay.length}
                      </span>
                    </p>
                    {committedDisplay.map((item, index) => {
                      const reasonLabel =
                        reasonOptions.find((r) => r.value === item.reason)?.label ??
                        item.reason;
                      return (
                        <div
                          key={index}
                          className="rounded-xl border border-border bg-muted/30 px-3 py-2.5"
                        >
                          <div className="flex items-start gap-2">
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium uppercase text-foreground">
                                {item.medicineName}
                              </p>
                              <p className="mt-0.5 text-xs text-muted-foreground">
                                {t.sdBatchLabel}: <span className="uppercase">{item.batchNumber}</span>
                                {item.expiryDate && (
                                  <> · {t.sdExpiryLabel}: {formatDate(item.expiryDate)}</>
                                )}
                              </p>
                              <div className="mt-1 flex items-center gap-2">
                                <span className="rounded-md bg-muted px-1.5 py-0.5 text-xs font-medium text-foreground">
                                  {item.quantityPieces} {item.unit}
                                </span>
                                <span className="rounded-md bg-amber-100 px-1.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                                  {reasonLabel}
                                </span>
                              </div>
                            </div>
                            <div className="flex shrink-0 items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleEditItem(index)}
                                disabled={isPending}
                                className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(index)}
                                disabled={isPending}
                                className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Empty state */}
                {committedDisplay.length === 0 && !isAddFormVisible && (
                  <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border bg-muted/20 px-4 py-10 text-center">
                    <FlaskConical className="h-8 w-8 text-muted-foreground/40" />
                    <p className="text-sm text-muted-foreground">{t.sdEmptyTitle}</p>
                    <p className="text-xs text-muted-foreground/60">
                      Search for a medicine above to add disposal items
                    </p>
                  </div>
                )}

                {/* Form-level error */}
                {typeof errors.details?.message === "string" && (
                  <p className="flex items-center gap-1 text-xs text-destructive">
                    <AlertCircle className="h-3 w-3" />
                    {errors.details.message}
                  </p>
                )}
              </div>
            </div>

            {/* ── RIGHT: signed by + description ────────────────────── */}
            <div className="flex flex-col gap-5 overflow-y-auto px-6 py-5">
              <div className="space-y-1.5">
                <Label>{t.sdSignedBy}</Label>
                <Controller
                  name="signedByUuid"
                  control={control}
                  render={({ field }) => (
                    <Combobox
                      value={field.value}
                      onValueChange={field.onChange}
                      options={signerOptions}
                      placeholder={t.sdSelectSignedBy}
                      disabled={isPending}
                    />
                  )}
                />
              </div>

              <div className="space-y-1.5">
                <Label>{t.sdDescription}</Label>
                <Textarea
                  {...register("description")}
                  placeholder={t.sdDescriptionPlaceholder}
                  rows={4}
                  disabled={isPending}
                  className="rounded-xl"
                />
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
            form="sd-form"
            disabled={isPending}
            className="min-w-[9rem] rounded-xl"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t.sdSaving}
              </>
            ) : (
              t.sdSave
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

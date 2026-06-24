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
import { toast } from "sonner";
import {
  ClipboardList,
  Loader2,
  Plus,
  Pencil,
  Trash2,
  AlertCircle,
  X,
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
  PurchaseOrder,
  CreatePurchaseOrderPayload,
  UpdatePurchaseOrderPayload,
} from "@/types/purchaseOrder";
import type { MedicineDropdownItem } from "@/types/medicine";
import {
  createPurchaseOrder,
  updatePurchaseOrder,
} from "@/service/purchaseOrderService";
import { getDistributorsDropdown } from "@/service/distributorService";
import { getMedicinesDropdown } from "@/service/medicineService";
import { getUsers } from "@/service/userService";

// ── Main form schema ──────────────────────────────────────────────────────────

function makeSchema(t: Translations) {
  return z.object({
    distributorUuid: z.string().min(1, t.poDistributorRequired),
    signedByUuid: z.string().optional(),
    description: z.string().optional(),
    details: z
      .array(
        z.object({
          medicineUuid: z.string(),
          quantity: z.number(),
          unit: z.string(),
          description: z.string().optional(),
        })
      )
      .min(1, t.poItemsRequired),
  });
}

interface FormValues {
  distributorUuid: string;
  signedByUuid: string;
  description: string;
  details: {
    medicineUuid: string;
    quantity: number;
    unit: string;
    description: string;
  }[];
}

// ── Item sub-form state ───────────────────────────────────────────────────────

interface ItemFormState {
  medicineUuid: string;
  quantity: string;
  unit: string;
  description: string;
}

interface ItemFormErrors {
  medicineUuid?: string;
  quantity?: string;
  unit?: string;
}

const EMPTY_ITEM: ItemFormState = {
  medicineUuid: "",
  quantity: "1",
  unit: "",
  description: "",
};

// ── Item sub-form ─────────────────────────────────────────────────────────────

interface ItemFormProps {
  value: ItemFormState;
  errors: ItemFormErrors;
  editingIndex: number | null;
  medicineOptions: { value: string; label: string }[];
  loadingMedicines: boolean;
  isPending: boolean;
  t: Translations;
  onChange: (next: ItemFormState) => void;
  onAdd: () => void;
  onCancelEdit: () => void;
}

function ItemForm({
  value,
  errors,
  editingIndex,
  medicineOptions,
  loadingMedicines,
  isPending,
  t,
  onChange,
  onAdd,
  onCancelEdit,
}: ItemFormProps): JSX.Element {
  const isEditing = editingIndex !== null;

  return (
    <div
      className={cn(
        "rounded-xl border p-4",
        isEditing
          ? "border-primary/40 bg-primary/5"
          : "border-border bg-muted/20"
      )}
    >
      {isEditing && (
        <p className="mb-3 text-xs font-semibold text-primary">
          Editing item #{editingIndex + 1}
        </p>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">
        {/* Medicine — 6 cols */}
        <div className="space-y-1 sm:col-span-6">
          <Label className="text-xs">{t.poItemMedicine}</Label>
          <Combobox
            value={value.medicineUuid}
            onValueChange={(uuid) => {
              const med = medicineOptions.find((m) => m.value === uuid);
              onChange({ ...value, medicineUuid: uuid });
              // unit is set separately via the medicine object lookup — handled in parent
              void med;
            }}
            options={medicineOptions}
            placeholder={
              loadingMedicines
                ? `${t.poItemSelectMedicine}...`
                : t.poItemSelectMedicine
            }
            disabled={isPending || loadingMedicines}
          />
          {errors.medicineUuid && (
            <p className="flex items-center gap-1 text-xs text-destructive">
              <AlertCircle className="h-3 w-3" />
              {errors.medicineUuid}
            </p>
          )}
        </div>

        {/* Quantity — 2 cols */}
        <div className="space-y-1 sm:col-span-2">
          <Label className="text-xs">{t.poItemQuantity}</Label>
          <Input
            type="number"
            min={1}
            value={value.quantity}
            onChange={(e) => onChange({ ...value, quantity: e.target.value.replace(/^0+(?=\d)/, "") })}
            disabled={isPending}
            className={cn(
              "rounded-xl",
              errors.quantity && "border-destructive"
            )}
          />
          {errors.quantity && (
            <p className="flex items-center gap-1 text-xs text-destructive"><AlertCircle className="h-3 w-3 shrink-0" />{errors.quantity}</p>
          )}
        </div>

        {/* Unit — 2 cols */}
        <div className="space-y-1 sm:col-span-2">
          <Label className="text-xs">{t.poItemUnit}</Label>
          <Input
            value={value.unit}
            onChange={(e) => onChange({ ...value, unit: e.target.value })}
            placeholder="e.g. Box"
            disabled={isPending}
            className={cn(
              "rounded-xl",
              errors.unit && "border-destructive"
            )}
          />
          {errors.unit && (
            <p className="flex items-center gap-1 text-xs text-destructive"><AlertCircle className="h-3 w-3 shrink-0" />{errors.unit}</p>
          )}
        </div>

        {/* Description — 12 cols */}
        <div className="space-y-1 sm:col-span-12">
          <Label className="text-xs">{t.poItemDescription}</Label>
          <Input
            value={value.description}
            onChange={(e) => onChange({ ...value, description: e.target.value })}
            placeholder={t.poItemDescriptionPlaceholder}
            disabled={isPending}
            className="rounded-xl"
          />
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-3 flex items-center gap-2">
        <Button
          type="button"
          size="sm"
          variant={isEditing ? "success" : "outline"}
          className="h-8 gap-1.5 rounded-xl text-xs"
          disabled={isPending}
          onClick={onAdd}
        >
          {isEditing ? (
            <>
              <Pencil className="h-3.5 w-3.5" />
              Update Item
            </>
          ) : (
            <>
              <Plus className="h-3.5 w-3.5" />
              {t.poItemAdd}
            </>
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

// ── Items table ───────────────────────────────────────────────────────────────

interface CommittedItem {
  medicineUuid: string;
  quantity: number;
  unit: string;
  description: string;
}

interface ItemsTableProps {
  items: CommittedItem[];
  medicines: MedicineDropdownItem[];
  editingIndex: number | null;
  isPending: boolean;
  t: Translations;
  onEdit: (index: number) => void;
  onRemove: (index: number) => void;
}

function ItemsTable({
  items,
  medicines,
  editingIndex,
  isPending,
  t,
  onEdit,
  onRemove,
}: ItemsTableProps): JSX.Element {
  if (items.length === 0) return <></>;

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted">
            <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              #
            </th>
            <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t.poItemMedicine}
            </th>
            <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t.poItemQuantity}
            </th>
            <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t.poItemUnit}
            </th>
            <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t.poItemDescription}
            </th>
            <th className="w-16 px-3 py-2" />
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {items.map((item, index) => {
            const med = medicines.find((m) => m.uuid === item.medicineUuid);
            const isActive = editingIndex === index;
            return (
              <tr
                key={index}
                className={cn(
                  "transition-colors",
                  isActive
                    ? "bg-primary/5"
                    : "hover:bg-accent/40"
                )}
              >
                <td className="px-3 py-2.5 text-xs text-muted-foreground">
                  {index + 1}
                </td>
                <td className="px-3 py-2.5">
                  <span className="font-medium text-foreground">
                    {med?.name ?? item.medicineUuid}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-foreground">{item.quantity}</td>
                <td className="px-3 py-2.5 text-foreground">{item.unit}</td>
                <td className="px-3 py-2.5 text-muted-foreground">
                  {item.description || (
                    <span className="text-muted-foreground/40">—</span>
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
          })}
        </tbody>
      </table>
    </div>
  );
}

// ── PurchaseOrderFormModal ────────────────────────────────────────────────────

export interface PurchaseOrderFormModalProps {
  mode: "create" | "edit";
  order?: PurchaseOrder;
  repurchaseFrom?: PurchaseOrder;
  onClose: () => void;
  onSuccess: (order: PurchaseOrder) => void;
}

export function PurchaseOrderFormModal({
  mode,
  order,
  repurchaseFrom,
  onClose,
  onSuccess,
}: PurchaseOrderFormModalProps): JSX.Element {
  const queryClient = useQueryClient();
  const { t, language } = useLanguage();

  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  // ── Item sub-form state ─────────────────────────────────────────────────────
  const [itemForm, setItemForm] = useState<ItemFormState>(EMPTY_ITEM);
  const [itemErrors, setItemErrors] = useState<ItemFormErrors>({});
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // ── Main form ───────────────────────────────────────────────────────────────
  const schema = useMemo(() => makeSchema(t), [t]);

  // When repurchasing, pre-fill from the source order (create mode only)
  const source = repurchaseFrom ?? order;

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      distributorUuid: source?.distributor.uuid ?? "",
      signedByUuid: source?.signedByUser?.uuid ?? "",
      description: source?.description ?? "",
      details:
        source?.details.map((d) => ({
          medicineUuid: d.medicine.uuid,
          quantity: d.quantity,
          unit: d.unit,
          description: d.description ?? "",
        })) ?? [],
    },
  });

  const { fields, append, update, remove } = useFieldArray({
    control,
    name: "details",
  });

  // ── Remote data ─────────────────────────────────────────────────────────────
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

  const distributorOptions = useMemo(
    () => (distributorsData?.data ?? []).map((d) => ({ value: d.uuid, label: d.name })),
    [distributorsData?.data]
  );

  const medicines = useMemo(
    () => medicinesData?.data ?? [],
    [medicinesData?.data]
  );

  const medicineOptions = useMemo(
    () => medicines.map((m) => ({ value: m.uuid, label: m.name })),
    [medicines]
  );

  const signerOptions = useMemo(
    () => [
      { value: "", label: t.poSelectSignedBy },
      ...(usersData?.data ?? []).map((u) => ({ value: u.uuid, label: u.name })),
    ],
    [usersData?.data, t.poSelectSignedBy]
  );

  // ── Item sub-form handlers ──────────────────────────────────────────────────
  function handleItemFormChange(next: ItemFormState): void {
    setItemForm(next);
    // auto-fill unit when medicine is selected and unit is empty
    if (next.medicineUuid !== itemForm.medicineUuid) {
      const med = medicines.find((m) => m.uuid === next.medicineUuid);
      if (med && !itemForm.unit) {
        setItemForm({ ...next, unit: med.unit });
        return;
      }
    }
    setItemForm(next);
  }

  function validateItemForm(): boolean {
    const errs: ItemFormErrors = {};
    if (!itemForm.medicineUuid) errs.medicineUuid = t.poItemMedicineRequired;
    const qty = Number(itemForm.quantity);
    if (!itemForm.quantity || isNaN(qty) || qty < 1 || !Number.isInteger(qty)) {
      errs.quantity = t.poItemQuantityRequired;
    }
    if (!itemForm.unit.trim()) errs.unit = t.poItemUnitRequired;
    setItemErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleAddOrUpdateItem(): void {
    if (!validateItemForm()) return;

    const committed = {
      medicineUuid: itemForm.medicineUuid,
      quantity: Number(itemForm.quantity),
      unit: itemForm.unit.trim(),
      description: itemForm.description.trim(),
    };

    if (editingIndex !== null) {
      update(editingIndex, committed);
      setEditingIndex(null);
    } else {
      append(committed);
    }

    setItemForm(EMPTY_ITEM);
    setItemErrors({});
  }

  function handleEditItem(index: number): void {
    const item = fields[index];
    setItemForm({
      medicineUuid: item.medicineUuid,
      quantity: String(item.quantity),
      unit: item.unit,
      description: item.description,
    });
    setEditingIndex(index);
    setItemErrors({});
  }

  function handleRemoveItem(index: number): void {
    remove(index);
    if (editingIndex === index) {
      setEditingIndex(null);
      setItemForm(EMPTY_ITEM);
      setItemErrors({});
    } else if (editingIndex !== null && index < editingIndex) {
      setEditingIndex(editingIndex - 1);
    }
  }

  function handleCancelEdit(): void {
    setEditingIndex(null);
    setItemForm(EMPTY_ITEM);
    setItemErrors({});
  }

  // ── Mutation ────────────────────────────────────────────────────────────────
  const mutation = useMutation({
    mutationFn: (values: FormValues) => {
      const details = values.details.map((d) => ({
        medicineUuid: d.medicineUuid,
        quantity: d.quantity,
        unit: d.unit,
        ...(d.description ? { description: d.description } : {}),
      }));

      if (mode === "create") {
        const payload: CreatePurchaseOrderPayload = {
          distributorUuid: values.distributorUuid,
          ...(values.signedByUuid ? { signedByUuid: values.signedByUuid } : {}),
          ...(values.description ? { description: values.description } : {}),
          details,
        };
        return createPurchaseOrder(payload);
      }

      const payload: UpdatePurchaseOrderPayload = {
        distributorUuid: values.distributorUuid,
        ...(values.signedByUuid ? { signedByUuid: values.signedByUuid } : {}),
        ...(values.description !== undefined ? { description: values.description } : {}),
        details,
      };
      return updatePurchaseOrder(order!.uuid, payload);
    },
    onSuccess: (res) => {
      if (res.success && res.data) {
        queryClient.invalidateQueries({ queryKey: ["purchase-orders"] });
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
        className="flex max-h-[90vh] max-w-2xl flex-col gap-0 p-0"
        onInteractOutside={(e) => {
          if (isPending) e.preventDefault();
        }}
      >
        {/* Header */}
        <DialogHeader className="flex flex-row items-center gap-3 space-y-0 border-b border-border px-6 py-4">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <ClipboardList className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <DialogTitle className="text-base">
              {repurchaseFrom
                ? t.poRepurchase
                : mode === "create"
                  ? t.poAdd
                  : t.poEdit}
            </DialogTitle>
            {(mode === "edit" || repurchaseFrom) && source && (
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {repurchaseFrom
                  ? `Based on ${source.orderNumber}`
                  : source.orderNumber}
              </p>
            )}
          </div>
        </DialogHeader>

        {/* Form body */}
        <form
          id="po-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto"
        >
          <div className="space-y-5 px-6 py-5">
            {/* Distributor */}
            <div className="space-y-1.5">
              <Label>{t.poDistributor}</Label>
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
                        ? `${t.poSelectDistributor}...`
                        : t.poSelectDistributor
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

            {/* Signed By */}
            <div className="space-y-1.5">
              <Label>{t.poSignedBy}</Label>
              <Controller
                name="signedByUuid"
                control={control}
                render={({ field }) => (
                  <Combobox
                    value={field.value}
                    onValueChange={field.onChange}
                    options={signerOptions}
                    placeholder={t.poSelectSignedBy}
                    disabled={isPending}
                  />
                )}
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label>{t.poDescription}</Label>
              <Textarea
                {...register("description")}
                placeholder={t.poDescriptionPlaceholder}
                rows={2}
                disabled={isPending}
                className="rounded-xl"
              />
            </div>

            {/* Items section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">
                  {t.poItemsSection}
                  {fields.length > 0 && (
                    <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      {fields.length}
                    </span>
                  )}
                </p>
              </div>

              {/* Item sub-form */}
              <ItemForm
                value={itemForm}
                errors={itemErrors}
                editingIndex={editingIndex}
                medicineOptions={medicineOptions}
                loadingMedicines={loadingMedicines}
                isPending={isPending}
                t={t}
                onChange={handleItemFormChange}
                onAdd={handleAddOrUpdateItem}
                onCancelEdit={handleCancelEdit}
              />

              {/* Committed items table */}
              <ItemsTable
                items={fields}
                medicines={medicines}
                editingIndex={editingIndex}
                isPending={isPending}
                t={t}
                onEdit={handleEditItem}
                onRemove={handleRemoveItem}
              />

              {/* items min-1 validation error */}
              {typeof errors.details?.message === "string" && (
                <p className="flex items-center gap-1 text-xs text-destructive">
                  <AlertCircle className="h-3 w-3" />
                  {errors.details.message}
                </p>
              )}
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
            form="po-form"
            disabled={isPending || isDataLoading}
            className="min-w-[9rem] rounded-xl"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t.poSaving}
              </>
            ) : (
              t.poSave
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

import type { JSX } from "react";
import { useMemo, useRef } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Pill, Loader2, Plus, Trash2, AlertCircle, Wand2 } from "lucide-react";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import { generateInStoreEan13 } from "@/utils/barcode";
import { Combobox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLanguage } from "@/hooks/useLanguage";
import type { Translations } from "@/configs/i18n";
import { getApiErrorMessage } from "@/utils/apiError";
import type { Medicine, CreateMedicinePayload, UpdateMedicinePayload } from "@/types/medicine";
import { createMedicine, updateMedicine } from "@/service/medicineService";
import { getMedicineShapesDropdown } from "@/service/medicineShapeService";
import { getMedicineTypesDropdown } from "@/service/medicineTypeService";
import { getMedicineClassesDropdown } from "@/service/medicineClassService";
import { useMedicineNameFormat, useNameFormat } from "@/hooks/useNameFormat";
import { buildMedicineName } from "@/utils/medicineName";
import {
  ORDER_LETTER_KINDS,
  PRESCRIPTION_ONLY_KINDS,
  type OrderLetterKind,
  orderLetterKindLabel,
  suggestOrderLetterKind,
} from "@/utils/orderLetter";

// ── Schema ────────────────────────────────────────────────────────────────────

function makeSchema(t: Translations) {
  return z.object({
    isCustomName: z.boolean(),
    name: z.string(),
    baseName: z.string(),
    variant: z.string().max(100),
    medicineShapeUuid: z.string().min(1, t.medicineShapeRequired),
    medicineTypeUuid: z.string().min(1, t.medicineTypeRequired),
    medicineClassUuid: z.string().min(1, t.medicineClassRequired),
    unit: z.string().min(1, t.medicineUnitRequired),
    barcode: z.string().trim().max(64).regex(/^[0-9A-Za-z\-./]*$/, t.medicineBarcodeInvalid),
    status: z.enum(["ACTIVE", "INACTIVE"]),
    ingredients: z.array(z.object({ value: z.string(), strength: z.string().max(50) })),
    /** "" follows the type. */
    orderLetterKind: z.string(),
  }).superRefine((v, ctx) => {
    // A custom name is typed whole; otherwise only the name part is required.
    const field = v.isCustomName ? "name" : "baseName";
    if (!v[field].trim()) ctx.addIssue({ code: "custom", path: [field], message: t.medicineNameRequired });
  });
}

interface FormValues {
  isCustomName: boolean;
  name: string;
  baseName: string;
  variant: string;
  medicineShapeUuid: string;
  medicineTypeUuid: string;
  medicineClassUuid: string;
  unit: string;
  barcode: string;
  status: "ACTIVE" | "INACTIVE";
  ingredients: { value: string; strength: string }[];
  orderLetterKind: "" | OrderLetterKind;
}

// ── Component ─────────────────────────────────────────────────────────────────

export interface MedicineFormModalProps {
  mode: "create" | "edit";
  medicine?: Medicine;
  onClose: () => void;
  onSuccess: () => void;
}

export function MedicineFormModal({
  mode,
  medicine,
  onClose,
  onSuccess,
}: MedicineFormModalProps): JSX.Element {
  const fmt = useNameFormat();
  const queryClient = useQueryClient();
  const { t, language } = useLanguage();
  const schema = useMemo(() => makeSchema(t), [t]);

  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  const defaultIngredients =
    medicine && medicine.ingredients.length > 0
      ? medicine.ingredients.map((i) => ({ value: i.name, strength: i.strength ?? "" }))
      : [{ value: "", strength: "" }];

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      isCustomName: medicine?.isCustomName ?? false,
      name: medicine?.name ?? "",
      baseName: medicine?.baseName ?? "",
      variant: medicine?.variant ?? "",
      medicineShapeUuid: medicine?.medicineShape?.uuid ?? "",
      medicineTypeUuid: medicine?.medicineType?.uuid ?? "",
      medicineClassUuid: medicine?.medicineClass?.uuid ?? "",
      unit: medicine?.unit ?? "",
      barcode: medicine?.barcode ?? "",
      status: medicine?.status ?? "ACTIVE",
      ingredients: defaultIngredients,
      orderLetterKind: medicine?.orderLetterKind ?? "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "ingredients",
  });

  const { data: shapesData } = useQuery({
    queryKey: ["medicine-shapes-dropdown"],
    queryFn: () => getMedicineShapesDropdown(),
  });
  const { data: typesData } = useQuery({
    queryKey: ["medicine-types-dropdown"],
    queryFn: () => getMedicineTypesDropdown(),
  });
  const { data: classesData } = useQuery({
    queryKey: ["medicine-classes-dropdown"],
    queryFn: () => getMedicineClassesDropdown(),
  });

  const shapes = shapesData?.data ?? [];
  const types = typesData?.data ?? [];
  const classes = classesData?.data ?? [];

  // Live preview of the name the server will store.
  const nameFormat = useMedicineNameFormat();
  const [isCustomName, baseName, variant, shapeUuid, ingredientValues] = form.watch([
    "isCustomName",
    "baseName",
    "variant",
    "medicineShapeUuid",
    "ingredients",
  ]);
  const shapeName = shapes.find((s) => s.uuid === shapeUuid)?.name ?? "";
  const selectedType = types.find((tp) => tp.uuid === form.watch("medicineTypeUuid"));
  const selectedTypeKind = selectedType?.orderLetterKind ?? "REGULAR";
  const kindOverride = form.watch("orderLetterKind");
  const effectiveKind: OrderLetterKind = kindOverride || selectedTypeKind;
  // Ingredients such as tramadol or pseudoephedrine point to a special letter the type doesn't give.
  const suggestedKind = effectiveKind === "REGULAR" ? suggestOrderLetterKind(ingredientValues.map((i) => i.value)) : null;
  // Narcotics and psychotropics are prescription-only, so their type must be too.
  const kindNeedsRxType = !!selectedType && PRESCRIPTION_ONLY_KINDS.includes(effectiveKind) && !selectedType.requiredPrescription;
  const previewName = isCustomName
    ? ""
    : buildMedicineName(nameFormat, {
        baseName,
        strengths: ingredientValues.filter((i) => i.value.trim()).map((i) => i.strength),
        shape: shapeName,
        variant,
      });

  function handleMutationError(error: unknown): void {
    toast.error(getApiErrorMessage(error, language, t.unexpectedError));
  }

  const createMutation = useMutation({
    mutationFn: createMedicine,
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ["medicines"] });
        queryClient.invalidateQueries({ queryKey: ["medicines-dropdown"] });
        onSuccessRef.current();
      } else {
        toast.error(res.message[language]);
      }
    },
    onError: handleMutationError,
  });

  const updateMutation = useMutation({
    mutationFn: ({ uuid, payload }: { uuid: string; payload: UpdateMedicinePayload }) =>
      updateMedicine(uuid, payload),
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ["medicines"] });
        queryClient.invalidateQueries({ queryKey: ["medicines-dropdown"] });
        onSuccessRef.current();
      } else {
        toast.error(res.message[language]);
      }
    },
    onError: handleMutationError,
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  function onSubmit(values: FormValues): void {
    if (kindNeedsRxType) return;
    const ingredients = values.ingredients
      .filter((i) => i.value.trim())
      .map((i) => ({ name: i.value.trim(), strength: i.strength.trim() || null }));
    const orderLetterKind = values.orderLetterKind || null;
    const naming = values.isCustomName
      ? { isCustomName: true, name: values.name.trim() }
      : { isCustomName: false, baseName: values.baseName.trim(), variant: values.variant.trim() || null };

    if (mode === "create") {
      const payload: CreateMedicinePayload = {
        ...naming,
        orderLetterKind,
        medicineShapeUuid: values.medicineShapeUuid,
        medicineTypeUuid: values.medicineTypeUuid,
        medicineClassUuid: values.medicineClassUuid,
        unit: values.unit,
        barcode: values.barcode.trim() || null,
        ingredients,
      };
      createMutation.mutate(payload);
    } else if (medicine) {
      const payload: UpdateMedicinePayload = {
        ...naming,
        orderLetterKind,
        medicineShapeUuid: values.medicineShapeUuid,
        medicineTypeUuid: values.medicineTypeUuid,
        medicineClassUuid: values.medicineClassUuid,
        unit: values.unit,
        barcode: values.barcode.trim() || null,
        status: values.status,
        ingredients,
      };
      updateMutation.mutate({ uuid: medicine.uuid, payload });
    }
  }

  const fieldError = (key: keyof FormValues) =>
    form.formState.errors[key]?.message;

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !isPending) onClose();
      }}
    >
      <DialogContent
        className="max-w-lg p-0"
        onInteractOutside={(e) => {
          if (isPending) e.preventDefault();
        }}
      >
        <DialogHeader className="flex flex-row items-center gap-3 space-y-0 border-b border-border px-6 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
            <Pill className="h-4 w-4 text-primary" />
          </div>
          <DialogTitle className="text-base">
            {mode === "create" ? t.medicineAdd : t.medicineEdit}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="max-h-[65vh] overflow-y-auto px-6 py-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

              {/* Name: built from its parts, or typed whole */}
              <div className="space-y-3 sm:col-span-2">
                <div className="flex items-center justify-between gap-3">
                  <Label htmlFor={isCustomName ? "med-name" : "med-base-name"}>
                    {t.medicineName}
                    <span className="ml-0.5 text-destructive">*</span>
                  </Label>
                  <label className="flex items-center gap-2 text-xs text-muted-foreground">
                    <input
                      type="checkbox"
                      {...form.register("isCustomName")}
                      className="h-4 w-4 accent-[hsl(var(--primary))]"
                    />
                    {t.medicineCustomName}
                  </label>
                </div>

                {isCustomName ? (
                  <>
                    <Input
                      id="med-name"
                      placeholder={t.medicineNamePlaceholder}
                      {...form.register("name")}
                      className={cn(fieldError("name") && "border-destructive focus-visible:ring-destructive/30")}
                    />
                    {fieldError("name") ? (
                      <p className="flex items-center gap-1 text-xs text-destructive"><AlertCircle className="h-3 w-3 shrink-0" />{fieldError("name")}</p>
                    ) : (
                      <p className="text-xs text-muted-foreground">{t.medicineCustomNameHint}</p>
                    )}
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_10rem]">
                      <div className="space-y-1">
                        <Input
                          id="med-base-name"
                          placeholder={t.medicineBaseNamePlaceholder}
                          {...form.register("baseName")}
                          className={cn(fieldError("baseName") && "border-destructive focus-visible:ring-destructive/30")}
                        />
                        {fieldError("baseName") && (
                          <p className="flex items-center gap-1 text-xs text-destructive"><AlertCircle className="h-3 w-3 shrink-0" />{fieldError("baseName")}</p>
                        )}
                      </div>
                      <Input
                        id="med-variant"
                        aria-label={t.medicineVariant}
                        placeholder={t.medicineVariantPlaceholder}
                        {...form.register("variant")}
                      />
                    </div>
                    <div className="rounded-xl bg-muted/50 px-3 py-2">
                      <p className="text-xs text-muted-foreground">{t.medicineNamePreview}</p>
                      <p className="mt-0.5 text-sm font-semibold name-case text-foreground">{previewName || "—"}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{t.medicineNamePreviewHint}</p>
                    </div>
                  </>
                )}
              </div>

              {/* Shape */}
              <div className="space-y-1.5">
                <Label htmlFor="med-shape">
                  {t.medicineShapeLabel}
                  <span className="ml-0.5 text-destructive">*</span>
                </Label>
                <Controller
                  name="medicineShapeUuid"
                  control={form.control}
                  render={({ field }) => (
                    <Combobox
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                      options={shapes.map((s) => ({ value: s.uuid, label: fmt(s.name) }))}
                      placeholder={t.medicineSelectShape}
                      className={cn(
                        fieldError("medicineShapeUuid") &&
                          "border-destructive focus:ring-destructive/30"
                      )}
                    />
                  )}
                />
                {fieldError("medicineShapeUuid") && (
                  <p className="flex items-center gap-1 text-xs text-destructive">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    {fieldError("medicineShapeUuid")}
                  </p>
                )}
              </div>

              {/* Type */}
              <div className="space-y-1.5">
                <Label htmlFor="med-type">
                  {t.medicineTypeLabel}
                  <span className="ml-0.5 text-destructive">*</span>
                </Label>
                <Controller
                  name="medicineTypeUuid"
                  control={form.control}
                  render={({ field }) => (
                    <Combobox
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                      options={types.map((tp) => ({ value: tp.uuid, label: fmt(tp.name) }))}
                      placeholder={t.medicineSelectType}
                      className={cn(
                        fieldError("medicineTypeUuid") &&
                          "border-destructive focus:ring-destructive/30"
                      )}
                    />
                  )}
                />
                {fieldError("medicineTypeUuid") && (
                  <p className="flex items-center gap-1 text-xs text-destructive">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    {fieldError("medicineTypeUuid")}
                  </p>
                )}
              </div>

              {/* Order letter: follows the type unless this medicine is a precursor or OOT in an ordinary type */}
              <div className="space-y-1.5">
                <Label htmlFor="med-order-letter">{t.orderLetterKind}</Label>
                <Controller
                  name="orderLetterKind"
                  control={form.control}
                  render={({ field }) => (
                    <Combobox
                      value={field.value || "TYPE"}
                      onValueChange={(v) => field.onChange(v === "TYPE" ? "" : v)}
                      options={[
                        {
                          value: "TYPE",
                          label: t.orderLetterFollowType.replace("{kind}", orderLetterKindLabel(selectedTypeKind, t)),
                        },
                        ...ORDER_LETTER_KINDS.map((k) => ({ value: k, label: orderLetterKindLabel(k, t) })),
                      ]}
                    />
                  )}
                />
                {kindNeedsRxType ? (
                  <p className="flex items-start gap-1 text-xs text-destructive">
                    <AlertCircle className="mt-0.5 h-3 w-3 shrink-0" />
                    {t.orderLetterNeedsRxType}
                  </p>
                ) : suggestedKind ? (
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg border border-warning/40 bg-warning/10 px-2.5 py-1.5 text-xs text-foreground">
                    <span>{t.orderLetterSuggestion.replace("{kind}", orderLetterKindLabel(suggestedKind, t))}</span>
                    <button
                      type="button"
                      className="font-semibold text-primary underline-offset-2 hover:underline"
                      onClick={() => form.setValue("orderLetterKind", suggestedKind, { shouldDirty: true })}
                    >
                      {t.orderLetterApplySuggestion}
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">{t.orderLetterMedicineHint}</p>
                )}
              </div>

              {/* Therapeutic Class */}
              <div className="space-y-1.5">
                <Label htmlFor="med-class">
                  {t.medicineClassLabel}
                  <span className="ml-0.5 text-destructive">*</span>
                </Label>
                <Controller
                  name="medicineClassUuid"
                  control={form.control}
                  render={({ field }) => (
                    <Combobox
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                      options={classes.map((cl) => ({ value: cl.uuid, label: fmt(cl.name) }))}
                      placeholder={t.medicineSelectClass}
                      className={cn(
                        fieldError("medicineClassUuid") &&
                          "border-destructive focus:ring-destructive/30"
                      )}
                    />
                  )}
                />
                {fieldError("medicineClassUuid") && (
                  <p className="flex items-center gap-1 text-xs text-destructive">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    {fieldError("medicineClassUuid")}
                  </p>
                )}
              </div>

              {/* Unit */}
              <div className="space-y-1.5">
                <Label htmlFor="med-unit">
                  {t.medicineUnit}
                  <span className="ml-0.5 text-destructive">*</span>
                </Label>
                <Input
                  id="med-unit"
                  placeholder={t.medicineUnitPlaceholder}
                  {...form.register("unit")}
                  className={cn(
                    fieldError("unit") &&
                      "border-destructive focus-visible:ring-destructive/30"
                  )}
                />
                {fieldError("unit") && (
                  <p className="flex items-center gap-1 text-xs text-destructive"><AlertCircle className="h-3 w-3 shrink-0" />{fieldError("unit")}</p>
                )}
              </div>

              {/* Barcode: scan the pack, or generate an in-store code */}
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="med-barcode">{t.medicineBarcode}</Label>
                <div className="flex gap-2">
                  <Input
                    id="med-barcode"
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder={t.medicineBarcodePlaceholder}
                    {...form.register("barcode")}
                    // USB scanners end with Enter: keep it from submitting the form.
                    onKeyDown={(e) => {
                      if (e.key === "Enter") e.preventDefault();
                    }}
                    className={cn(
                      "font-mono",
                      fieldError("barcode") && "border-destructive focus-visible:ring-destructive/30"
                    )}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="shrink-0 gap-1.5 rounded-xl"
                    onClick={() => form.setValue("barcode", generateInStoreEan13(), { shouldDirty: true, shouldValidate: true })}
                  >
                    <Wand2 className="h-4 w-4" />
                    {t.medicineBarcodeGenerate}
                  </Button>
                </div>
                {fieldError("barcode") ? (
                  <p className="flex items-center gap-1 text-xs text-destructive"><AlertCircle className="h-3 w-3 shrink-0" />{fieldError("barcode")}</p>
                ) : (
                  <p className="text-xs text-muted-foreground">{t.medicineBarcodeHint}</p>
                )}
              </div>

              {/* Status — edit only */}
              {mode === "edit" && (
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="med-status">{t.medicineStatusLabel}</Label>
                  <Controller
                    name="status"
                    control={form.control}
                    render={({ field }) => (
                      <Combobox
                        value={field.value ?? ""}
                        onValueChange={field.onChange}
                        options={[
                          { value: "ACTIVE", label: t.medicineStatusActive },
                          { value: "INACTIVE", label: t.medicineStatusInactive },
                        ]}
                      />
                    )}
                  />
                </div>
              )}

              {/* Ingredients */}
              <div className="space-y-2 sm:col-span-2">
                <Label>{t.medicineIngredients}</Label>
                <p className="text-xs text-muted-foreground">{t.medicineIngredientsHint}</p>

                <div className="space-y-2">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                      <Input
                        placeholder={t.medicineIngredientPlaceholder}
                        {...form.register(`ingredients.${index}.value`)}
                        className={cn(
                          "min-w-0 flex-1",
                          form.formState.errors.ingredients?.[index]?.value &&
                            "border-destructive focus-visible:ring-destructive/30"
                        )}
                      />
                      <Input
                        placeholder={t.medicineStrengthPlaceholder}
                        aria-label={t.medicineStrength}
                        {...form.register(`ingredients.${index}.strength`)}
                        className="w-28 shrink-0"
                      />
                      {fields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none"
                          aria-label={t.medicineIngredientRemove}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {form.formState.errors.ingredients?.root?.message && (
                  <p className="flex items-center gap-1 text-xs text-destructive">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    {form.formState.errors.ingredients.root.message}
                  </p>
                )}

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-1.5 rounded-lg"
                  onClick={() => append({ value: "", strength: "" })}
                >
                  <Plus className="h-3.5 w-3.5" />
                  {t.medicineIngredientAdd}
                </Button>
              </div>
            </div>
          </div>

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
              disabled={isPending}
              className="min-w-[6rem] rounded-xl"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t.medicineSaving}
                </>
              ) : (
                t.medicineSave
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

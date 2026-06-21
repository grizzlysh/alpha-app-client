import type { JSX } from "react";
import { useMemo, useRef } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Pill, Loader2, Plus, Trash2, AlertCircle } from "lucide-react";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
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

// ── Schema ────────────────────────────────────────────────────────────────────

function makeSchema(t: Translations) {
  return z.object({
    name: z.string().min(1, t.medicineNameRequired),
    medicineShapeUuid: z.string().min(1, t.medicineShapeRequired),
    medicineTypeUuid: z.string().min(1, t.medicineTypeRequired),
    medicineClassUuid: z.string().min(1, t.medicineClassRequired),
    unit: z.string().min(1, t.medicineUnitRequired),
    status: z.enum(["ACTIVE", "INACTIVE"]),
    ingredients: z
      .array(z.object({ value: z.string().min(1) }))
      .min(1, t.medicineIngredientsRequired),
  });
}

interface FormValues {
  name: string;
  medicineShapeUuid: string;
  medicineTypeUuid: string;
  medicineClassUuid: string;
  unit: string;
  status: "ACTIVE" | "INACTIVE";
  ingredients: { value: string }[];
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
  const queryClient = useQueryClient();
  const { t, language } = useLanguage();
  const schema = useMemo(() => makeSchema(t), [t]);

  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  const defaultIngredients =
    medicine && medicine.ingredients.length > 0
      ? medicine.ingredients.map((i) => ({ value: i.name }))
      : [{ value: "" }];

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: medicine?.name ?? "",
      medicineShapeUuid: medicine?.medicineShape?.uuid ?? "",
      medicineTypeUuid: medicine?.medicineType?.uuid ?? "",
      medicineClassUuid: medicine?.medicineClass?.uuid ?? "",
      unit: medicine?.unit ?? "",
      status: medicine?.status ?? "ACTIVE",
      ingredients: defaultIngredients,
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

  function handleMutationError(error: unknown): void {
    toast.error(getApiErrorMessage(error, language, t.unexpectedError));
  }

  const createMutation = useMutation({
    mutationFn: createMedicine,
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ["medicines"] });
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
        onSuccessRef.current();
      } else {
        toast.error(res.message[language]);
      }
    },
    onError: handleMutationError,
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  function onSubmit(values: FormValues): void {
    const ingredients = values.ingredients.map((i) => i.value);

    if (mode === "create") {
      const payload: CreateMedicinePayload = {
        name: values.name,
        medicineShapeUuid: values.medicineShapeUuid,
        medicineTypeUuid: values.medicineTypeUuid,
        medicineClassUuid: values.medicineClassUuid,
        unit: values.unit,
        status: values.status,
        ingredients,
      };
      createMutation.mutate(payload);
    } else if (medicine) {
      const payload: UpdateMedicinePayload = {
        name: values.name,
        medicineShapeUuid: values.medicineShapeUuid,
        medicineTypeUuid: values.medicineTypeUuid,
        medicineClassUuid: values.medicineClassUuid,
        unit: values.unit,
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
            <div className="grid gap-4 sm:grid-cols-2">

              {/* Name */}
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="med-name">
                  {t.medicineName}
                  <span className="ml-0.5 text-destructive">*</span>
                </Label>
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <Input
                      id="med-name"
                      placeholder={t.medicineNamePlaceholder}
                      {...field}
                      className={cn(
                        fieldError("name") &&
                          "border-destructive focus-visible:ring-destructive/30"
                      )}
                    />
                  )}
                />
                {fieldError("name") && (
                  <p className="flex items-center gap-1 text-xs text-destructive"><AlertCircle className="h-3 w-3 shrink-0" />{fieldError("name")}</p>
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
                      options={shapes.map((s) => ({ value: s.uuid, label: s.name }))}
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
                      options={types.map((tp) => ({ value: tp.uuid, label: tp.name }))}
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
                      options={classes.map((cl) => ({ value: cl.uuid, label: cl.name }))}
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

              {/* Status */}
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

              {/* Ingredients */}
              <div className="space-y-2 sm:col-span-2">
                <Label>
                  {t.medicineIngredients}
                  <span className="ml-0.5 text-destructive">*</span>
                </Label>

                <div className="space-y-2">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                      <Input
                        placeholder={t.medicineIngredientPlaceholder}
                        {...form.register(`ingredients.${index}.value`)}
                        className={cn(
                          "flex-1",
                          form.formState.errors.ingredients?.[index]?.value &&
                            "border-destructive focus-visible:ring-destructive/30"
                        )}
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
                  onClick={() => append({ value: "" })}
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

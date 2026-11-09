import type { JSX } from "react";
import { useMemo, useRef, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { FileText, Loader2, AlertCircle, Plus, Trash2, Stethoscope } from "lucide-react";

import { cn } from "@/utils/cn";
import { toDoctorName } from "@/utils/stringHelpers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Combobox } from "@/components/ui/combobox";
import { ComboboxCreatable } from "@/components/ui/combobox-creatable";
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
import type { Prescription, PrescriptionListItem } from "@/types/prescription";
import { createPrescription, updatePrescription } from "@/service/prescriptionService";
import { getCustomersDropdown } from "@/service/customerService";
import { getDoctorsDropdown } from "@/service/doctorService";
import { getMedicinesDropdown } from "@/service/medicineService";

// ── Schema ────────────────────────────────────────────────────────────────────

function makeSchema(t: Translations) {
  return z.object({
    patientUuid: z.string().min(1, t.prescriptionPatientRequired),
    doctorUuid: z.string(),
    prescribedAt: z.string().min(1, "Date is required"),
    notes: z.string(),
    items: z
      .array(
        z.object({
          uuid: z.string().optional(),
          medicineName: z.string().min(1, t.prescriptionItemMedicineRequired),
          qty: z.coerce.number().int().min(1, t.prescriptionItemQtyRequired),
          frequency: z.string(),
          duration: z.string(),
          notes: z.string(),
        })
      )
      .min(1),
  });
}

type FormValues = z.infer<ReturnType<typeof makeSchema>>;

// ── Pending item state ────────────────────────────────────────────────────────

interface PendingItem {
  medicineName: string;
  qty: number | "";
  frequency: string;
  duration: string;
  notes: string;
}

const EMPTY_PENDING: PendingItem = {
  medicineName: "",
  qty: 1,
  frequency: "",
  duration: "",
  notes: "",
};

// ── Items table ───────────────────────────────────────────────────────────────

interface ItemsTableProps {
  items: FormValues["items"];
  isPending: boolean;
  t: Translations;
  onRemove: (index: number) => void;
}

function ItemsTable({ items, isPending, t, onRemove }: ItemsTableProps): JSX.Element {
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted">
            <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              #
            </th>
            <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t.prescriptionItemMedicine}
            </th>
            <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t.prescriptionItemQty}
            </th>
            <th className="hidden px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:table-cell">
              {t.prescriptionItemFrequency}
            </th>
            <th className="hidden px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:table-cell">
              {t.prescriptionItemDuration}
            </th>
            <th className="w-12 px-3 py-2" />
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {items.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-3 py-5 text-center text-xs text-muted-foreground">
                {t.prescriptionItemAdd}
              </td>
            </tr>
          ) : (
            items.map((item, index) => (
              <tr key={index} className="transition-colors hover:bg-accent/40">
                <td className="px-3 py-2.5 text-xs text-muted-foreground">{index + 1}</td>
                <td className="px-3 py-2.5">
                  <p className="font-medium text-foreground">{item.medicineName}</p>
                  {item.notes && (
                    <p className="text-xs italic text-muted-foreground">{item.notes}</p>
                  )}
                </td>
                <td className="px-3 py-2.5 text-right text-foreground">{item.qty}</td>
                <td className="hidden px-3 py-2.5 text-muted-foreground sm:table-cell">
                  {item.frequency || "—"}
                </td>
                <td className="hidden px-3 py-2.5 text-muted-foreground sm:table-cell">
                  {item.duration || "—"}
                </td>
                <td className="px-3 py-2.5">
                  <button
                    type="button"
                    onClick={() => onRemove(index)}
                    disabled={isPending}
                    className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

/** Writing a prescription out of a medical visit: patient is fixed, doctor pre-filled. */
export interface PrescriptionVisitPrefill {
  customerUuid: string;
  customerName: string;
  doctorUuid?: string;
  medicalVisitUuid: string;
  /** e.g. "5 Mar 2026 · Tension headache" */
  visitLabel: string;
}

export interface PrescriptionFormModalProps {
  mode: "create" | "edit";
  prescription?: PrescriptionListItem & { fullData?: Prescription };
  initialData?: Prescription;
  fromVisit?: PrescriptionVisitPrefill;
  onClose: () => void;
  onSuccess: () => void;
}

export function PrescriptionFormModal({
  mode,
  initialData,
  fromVisit,
  onClose,
  onSuccess,
}: PrescriptionFormModalProps): JSX.Element {
  const queryClient = useQueryClient();
  const { t, language } = useLanguage();
  const schema = useMemo(() => makeSchema(t), [t]);
  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  const [pending, setPending] = useState<PendingItem>(EMPTY_PENDING);
  const [pendingError, setPendingError] = useState("");

  const { data: patientsData } = useQuery({
    queryKey: ["customers-dropdown", { customerType: "PATIENT" }],
    queryFn: () => getCustomersDropdown({ customerType: "PATIENT" }),
    staleTime: 5 * 60 * 1000,
  });

  const { data: doctorsData } = useQuery({
    queryKey: ["doctors-dropdown"],
    queryFn: () => getDoctorsDropdown(),
    staleTime: 5 * 60 * 1000,
  });

  const { data: medicinesData } = useQuery({
    queryKey: ["medicines-dropdown"],
    queryFn: getMedicinesDropdown,
    staleTime: 5 * 60 * 1000,
  });

  const patientOptions = useMemo(
    () =>
      (patientsData?.data ?? []).map((c) => ({ value: c.uuid, label: c.name })),
    [patientsData]
  );

  const doctorOptions = useMemo(
    () => [
      { value: "", label: `— ${t.prescriptionDoctorPlaceholder} —` },
      ...(doctorsData?.data ?? []).map((d) => ({
        value: d.uuid,
        label: d.clinicName ? `${toDoctorName(d.name)} (${d.clinicName})` : toDoctorName(d.name),
      })),
    ],
    [doctorsData, t]
  );

  const medicineOptions = useMemo(
    () => (medicinesData?.data ?? []).map((m) => ({ value: m.name, label: m.name })),
    [medicinesData]
  );

  const todayIso = new Date().toISOString().split("T")[0];

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      patientUuid: initialData?.customer?.uuid ?? fromVisit?.customerUuid ?? "",
      doctorUuid: initialData?.doctor?.uuid ?? fromVisit?.doctorUuid ?? "",
      prescribedAt: initialData?.prescribedAt
        ? initialData.prescribedAt.split("T")[0]
        : todayIso,
      notes: initialData?.notes ?? "",
      items:
        initialData?.details && initialData.details.length > 0
          ? initialData.details.map((d) => ({
              uuid: d.uuid,
              medicineName: d.medicineName,
              qty: d.qty,
              frequency: d.frequency ?? "",
              duration: d.duration ?? "",
              notes: d.notes ?? "",
            }))
          : [],
    },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: "items" });

  function handleAddItem(): void {
    const name = pending.medicineName.trim();
    if (!name) {
      setPendingError(t.prescriptionItemMedicineRequired);
      return;
    }
    const qty = pending.qty === "" ? 1 : Number(pending.qty);
    append({
      medicineName: name,
      qty,
      frequency: pending.frequency,
      duration: pending.duration,
      notes: pending.notes,
    });
    setPending(EMPTY_PENDING);
    setPendingError("");
  }

  function handleMutationError(error: unknown): void {
    toast.error(getApiErrorMessage(error, language, t.unexpectedError));
  }

  const createMutation = useMutation({
    mutationFn: createPrescription,
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ["prescriptions"] });
        if (fromVisit) queryClient.invalidateQueries({ queryKey: ["medical-visits", fromVisit.customerUuid] });
        onSuccessRef.current();
      } else {
        toast.error(res.message[language]);
      }
    },
    onError: handleMutationError,
  });

  const updateMutation = useMutation({
    mutationFn: ({ uuid, payload }: { uuid: string; payload: FormValues }) =>
      updatePrescription(uuid, {
        doctorUuid: payload.doctorUuid || null,
        prescribedAt: payload.prescribedAt,
        notes: payload.notes || null,
        items: payload.items.map((item) => ({
          uuid: item.uuid,
          medicineName: item.medicineName,
          qty: item.qty,
          frequency: item.frequency || undefined,
          duration: item.duration || undefined,
          notes: item.notes || undefined,
        })),
      }),
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ["prescriptions"] });
        onSuccessRef.current();
      } else {
        toast.error(res.message[language]);
      }
    },
    onError: handleMutationError,
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  function onSubmit(values: FormValues): void {
    if (mode === "create") {
      createMutation.mutate({
        customerUuid: values.patientUuid,
        doctorUuid: values.doctorUuid || undefined,
        medicalVisitUuid: fromVisit?.medicalVisitUuid,
        prescribedAt: values.prescribedAt,
        notes: values.notes || undefined,
        items: values.items.map((item) => ({
          medicineName: item.medicineName,
          qty: item.qty,
          frequency: item.frequency || undefined,
          duration: item.duration || undefined,
          notes: item.notes || undefined,
        })),
      });
    } else if (initialData) {
      updateMutation.mutate({ uuid: initialData.uuid, payload: values });
    }
  }

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !isPending) onClose();
      }}
    >
      <DialogContent
        className="max-w-2xl p-0"
        onInteractOutside={(e) => {
          if (isPending) e.preventDefault();
        }}
      >
        <DialogHeader className="flex flex-row items-center gap-3 space-y-0 border-b border-border px-6 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
            <FileText className="h-4 w-4 text-primary" />
          </div>
          <DialogTitle className="text-base">
            {mode === "create" ? t.prescriptionAdd : t.prescriptionEdit}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
            {fromVisit && (
              <div className="mb-4 flex items-center gap-2 rounded-xl border border-border bg-muted/30 px-3 py-2 text-sm">
                <Stethoscope className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                <span className="text-muted-foreground">{t.prescriptionFromVisit}:</span>
                <span className="truncate font-medium text-foreground">{fromVisit.visitLabel}</span>
              </div>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Patient */}
              <div className="space-y-1.5 sm:col-span-2">
                <Label>
                  {t.prescriptionPatient}
                  <span className="ml-0.5 text-destructive">*</span>
                </Label>
                <Controller
                  name="patientUuid"
                  control={form.control}
                  render={({ field }) => (
                    <Combobox
                      value={field.value}
                      onValueChange={field.onChange}
                      options={
                        fromVisit && !patientOptions.some((o) => o.value === fromVisit.customerUuid)
                          ? [{ value: fromVisit.customerUuid, label: fromVisit.customerName }, ...patientOptions]
                          : patientOptions
                      }
                      placeholder={t.prescriptionPatientPlaceholder}
                      searchPlaceholder={t.prescriptionPatientPlaceholder}
                      disabled={mode === "edit" || Boolean(fromVisit)}
                      className={cn(
                        "h-10 w-full rounded-xl",
                        form.formState.errors.patientUuid && "border-destructive"
                      )}
                    />
                  )}
                />
                {form.formState.errors.patientUuid && (
                  <p className="flex items-center gap-1 text-xs text-destructive">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    {form.formState.errors.patientUuid.message}
                  </p>
                )}
              </div>

              {/* Doctor */}
              <div className="space-y-1.5 sm:col-span-2">
                <Label>{t.prescriptionDoctor}</Label>
                <Controller
                  name="doctorUuid"
                  control={form.control}
                  render={({ field }) => (
                    <Combobox
                      value={field.value}
                      onValueChange={field.onChange}
                      options={doctorOptions}
                      placeholder={t.prescriptionDoctorPlaceholder}
                      searchPlaceholder={t.prescriptionDoctorPlaceholder}
                      className="h-10 w-full rounded-xl"
                    />
                  )}
                />
              </div>

              {/* Prescribed Date */}
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="rx-date">
                  {t.prescriptionPrescribedAt}
                  <span className="ml-0.5 text-destructive">*</span>
                </Label>
                <Controller
                  name="prescribedAt"
                  control={form.control}
                  render={({ field }) => (
                    <DateInput
                      id="rx-date"
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      disabled={isPending}
                      placeholder={t.prescriptionPrescribedAt}
                      className="rounded-xl"
                    />
                  )}
                />
              </div>

              {/* Notes */}
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="rx-notes">{t.prescriptionNotes}</Label>
                <Textarea
                  id="rx-notes"
                  rows={2}
                  placeholder={t.prescriptionNotesPlaceholder}
                  className="resize-none"
                  {...form.register("notes")}
                />
              </div>

              {/* Items section */}
              <div className="space-y-3 sm:col-span-2">
                <div className="flex items-center justify-between">
                  <Label>{t.prescriptionItemsLabel}</Label>
                  {fields.length > 0 && (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                      {fields.length}
                    </span>
                  )}
                </div>

                {/* Committed items table */}
                {fields.length > 0 && (
                  <ItemsTable
                    items={fields}
                    isPending={isPending}
                    t={t}
                    onRemove={remove}
                  />
                )}

                {/* Item validation error */}
                {form.formState.errors.items?.root && (
                  <p className="flex items-center gap-1 text-xs text-destructive">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    {form.formState.errors.items.root.message}
                  </p>
                )}

                {/* Inline add-item form */}
                <div className="rounded-xl border border-dashed border-border bg-muted/10 p-3">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {t.prescriptionItemAdd}
                  </p>
                  <div className="grid gap-2 sm:grid-cols-4">
                    {/* Medicine name — 3 cols */}
                    <div className="space-y-1 sm:col-span-3">
                      <Label className="text-xs">{t.prescriptionItemMedicine} *</Label>
                      <ComboboxCreatable
                        value={pending.medicineName}
                        onValueChange={(val) => {
                          setPending((p) => ({ ...p, medicineName: val }));
                          if (pendingError) setPendingError("");
                        }}
                        options={medicineOptions}
                        placeholder={t.prescriptionItemMedicinePlaceholder}
                        searchPlaceholder={t.prescriptionItemMedicinePlaceholder}
                        creatableLabel={(input) => t.useValue.replace("%s", input)}
                        className={cn(
                          "h-9 rounded-xl",
                          pendingError && "border-destructive"
                        )}
                      />
                      {pendingError && (
                        <p className="flex items-center gap-1 text-xs text-destructive">
                          <AlertCircle className="h-3 w-3 shrink-0" />
                          {pendingError}
                        </p>
                      )}
                    </div>

                    {/* Qty */}
                    <div className="space-y-1">
                      <Label className="text-xs">{t.prescriptionItemQty} *</Label>
                      <Input
                        type="number"
                        min={1}
                        value={pending.qty}
                        onChange={(e) =>
                          setPending((p) => ({
                            ...p,
                            qty: e.target.value === "" ? "" : parseInt(e.target.value, 10),
                          }))
                        }
                        placeholder="1"
                      />
                    </div>

                    {/* Frequency */}
                    <div className="space-y-1 sm:col-span-2">
                      <Label className="text-xs">{t.prescriptionItemFrequency}</Label>
                      <Input
                        value={pending.frequency}
                        onChange={(e) => setPending((p) => ({ ...p, frequency: e.target.value }))}
                        placeholder={t.prescriptionItemFrequencyPlaceholder}
                      />
                    </div>

                    {/* Duration */}
                    <div className="space-y-1 sm:col-span-2">
                      <Label className="text-xs">{t.prescriptionItemDuration}</Label>
                      <Input
                        value={pending.duration}
                        onChange={(e) => setPending((p) => ({ ...p, duration: e.target.value }))}
                        placeholder={t.prescriptionItemDurationPlaceholder}
                      />
                    </div>

                    {/* Item notes */}
                    <div className="space-y-1 sm:col-span-3">
                      <Label className="text-xs">{t.prescriptionItemNotes}</Label>
                      <Input
                        value={pending.notes}
                        onChange={(e) => setPending((p) => ({ ...p, notes: e.target.value }))}
                        placeholder={t.prescriptionItemNotesPlaceholder}
                      />
                    </div>

                    {/* Add button */}
                    <div className="flex items-end sm:col-span-1">
                      <Button
                        type="button"
                        variant="outline"
                        className="h-10 w-full gap-1.5 rounded-xl"
                        onClick={handleAddItem}
                      >
                        <Plus className="h-4 w-4" />
                        {t.prescriptionItemAdd}
                      </Button>
                    </div>
                  </div>
                </div>
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
              className="min-w-[8rem] rounded-xl"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t.prescriptionSaving}
                </>
              ) : (
                t.prescriptionSave
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

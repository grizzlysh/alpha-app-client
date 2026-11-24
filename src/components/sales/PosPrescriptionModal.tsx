import type { JSX } from "react";
import { useMemo } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { FileText, Loader2, AlertCircle, Plus, Trash2 } from "lucide-react";

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
import { getApiErrorMessage } from "@/utils/apiError";
import { LiveToastMessage } from "@/components/shared/LiveToastMessage";
import { createPrescription } from "@/service/prescriptionService";
import { getDoctorsDropdown } from "@/service/doctorService";
import type { CartItem } from "./PosCartPanel";

// ── Schema ────────────────────────────────────────────────────────────────────

const schema = z.object({
  doctorUuid: z.string(),
  prescriptionNumber: z.string(),
  prescribedAt: z.string().min(1),
  notes: z.string(),
  items: z
    .array(
      z.object({
        medicineName: z.string().min(1, "Required"),
        qty: z.coerce.number().int().min(1, "Min 1"),
        frequency: z.string(),
        duration: z.string(),
      })
    )
    .min(1),
});

type FormValues = z.infer<typeof schema>;

// ── Props ─────────────────────────────────────────────────────────────────────

export interface PosPrescriptionModalProps {
  patientUuid: string;
  patientName: string;
  rxItems: CartItem[];
  onClose: () => void;
  onSuccess: (prescriptionUuid: string) => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function PosPrescriptionModal({
  patientUuid,
  patientName,
  rxItems,
  onClose,
  onSuccess,
}: PosPrescriptionModalProps): JSX.Element {
  const queryClient = useQueryClient();
  const { t, language } = useLanguage();

  const { data: doctorsData } = useQuery({
    queryKey: ["doctors-dropdown"],
    queryFn: () => getDoctorsDropdown(),
    staleTime: 5 * 60 * 1000,
  });

  const doctorOptions = useMemo(
    () => [
      { value: "", label: `— ${t.prescriptionDoctorPlaceholder} —` },
      ...(doctorsData?.data ?? []).map((d) => ({
        value: d.uuid,
        label: d.clinicName ? `${d.name} (${d.clinicName})` : d.name,
      })),
    ],
    [doctorsData, t]
  );

  const todayIso = new Date().toISOString().split("T")[0];

  const defaultItems: FormValues["items"] =
    rxItems.length > 0
      ? rxItems.map((item) => ({
          medicineName: item.medicineName,
          qty: item.quantityPieces,
          frequency: "",
          duration: "",
        }))
      : [{ medicineName: "", qty: 1, frequency: "", duration: "" }];

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      doctorUuid: "",
      prescriptionNumber: "",
      prescribedAt: todayIso,
      notes: "",
      items: defaultItems,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const createMutation = useMutation({
    mutationFn: createPrescription,
    onSuccess: (res) => {
      if (res.success && res.data) {
        queryClient.invalidateQueries({ queryKey: ["prescriptions"] });
        queryClient.invalidateQueries({ queryKey: ["prescriptions-queue"] });
        toast.success(<LiveToastMessage getMessage={(t) => t.posCreatePrescriptionSuccess} />);
        onSuccess(res.data.uuid);
      } else {
        toast.error(res.message[language]);
      }
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, language, t.unexpectedError));
    },
  });

  const isPending = createMutation.isPending;

  function onSubmit(values: FormValues): void {
    createMutation.mutate({
      customerUuid: patientUuid,
      doctorUuid: values.doctorUuid || undefined,
      prescriptionNumber: values.prescriptionNumber || undefined,
      prescribedAt: values.prescribedAt,
      notes: values.notes || undefined,
      items: values.items.map((item) => ({
        medicineName: item.medicineName,
        qty: item.qty,
        frequency: item.frequency || undefined,
        duration: item.duration || undefined,
      })),
    });
  }

  return (
    <Dialog open onOpenChange={(open) => { if (!open && !isPending) onClose(); }}>
      <DialogContent
        className="max-w-2xl p-0"
        onInteractOutside={(e) => { if (isPending) e.preventDefault(); }}
      >
        <DialogHeader className="flex flex-row items-center gap-3 space-y-0 border-b border-border px-6 py-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <FileText className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <DialogTitle className="text-base">{t.posCreatePrescriptionTitle}</DialogTitle>
            <p className="truncate text-xs text-muted-foreground">{patientName}</p>
          </div>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
            <div className="grid gap-4 sm:grid-cols-2">

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

              {/* Prescription number */}
              <div className="space-y-1.5">
                <Label htmlFor="rx-number">{t.prescriptionNumber}</Label>
                <Input
                  id="rx-number"
                  placeholder={t.prescriptionNumberPlaceholder}
                  {...form.register("prescriptionNumber")}
                />
              </div>

              {/* Prescribed date */}
              <div className="space-y-1.5">
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

              {/* Items */}
              <div className="space-y-3 sm:col-span-2">
                <div className="flex items-center justify-between">
                  <Label>{t.prescriptionItemsLabel}</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1.5 rounded-lg text-xs"
                    onClick={() =>
                      append({ medicineName: "", qty: 1, frequency: "", duration: "" })
                    }
                  >
                    <Plus className="h-3.5 w-3.5" />
                    {t.prescriptionItemAdd}
                  </Button>
                </div>

                <div className="space-y-3">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="rounded-xl border border-border bg-muted/20 p-4"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          #{index + 1}
                        </span>
                        {fields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="grid gap-3 sm:grid-cols-4">
                        {/* Medicine name */}
                        <div className="space-y-1.5 sm:col-span-3">
                          <Label htmlFor={`item-name-${index}`}>
                            {t.prescriptionItemMedicine}
                            <span className="ml-0.5 text-destructive">*</span>
                          </Label>
                          <Input
                            id={`item-name-${index}`}
                            placeholder={t.prescriptionItemMedicinePlaceholder}
                            {...form.register(`items.${index}.medicineName`)}
                            className={cn(
                              form.formState.errors.items?.[index]?.medicineName &&
                                "border-destructive focus-visible:ring-destructive/30"
                            )}
                          />
                          {form.formState.errors.items?.[index]?.medicineName && (
                            <p className="flex items-center gap-1 text-xs text-destructive">
                              <AlertCircle className="h-3 w-3 shrink-0" />
                              {form.formState.errors.items[index]?.medicineName?.message}
                            </p>
                          )}
                        </div>

                        {/* Qty */}
                        <div className="space-y-1.5">
                          <Label htmlFor={`item-qty-${index}`}>
                            {t.prescriptionItemQty}
                            <span className="ml-0.5 text-destructive">*</span>
                          </Label>
                          <Input
                            id={`item-qty-${index}`}
                            type="number"
                            min={1}
                            placeholder="1"
                            {...form.register(`items.${index}.qty`)}
                          />
                        </div>

                        {/* Frequency */}
                        <div className="space-y-1.5 sm:col-span-2">
                          <Label htmlFor={`item-freq-${index}`}>{t.prescriptionItemFrequency}</Label>
                          <Input
                            id={`item-freq-${index}`}
                            placeholder={t.prescriptionItemFrequencyPlaceholder}
                            {...form.register(`items.${index}.frequency`)}
                          />
                        </div>

                        {/* Duration */}
                        <div className="space-y-1.5 sm:col-span-2">
                          <Label htmlFor={`item-dur-${index}`}>{t.prescriptionItemDuration}</Label>
                          <Input
                            id={`item-dur-${index}`}
                            placeholder={t.prescriptionItemDurationPlaceholder}
                            {...form.register(`items.${index}.duration`)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
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
              className="min-w-[9rem] gap-2 rounded-xl"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t.prescriptionSaving}
                </>
              ) : (
                t.posCreatePrescriptionSave
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

import type { JSX } from "react";
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Combobox } from "@/components/ui/combobox";
import { DateInput } from "@/components/ui/date-input";
import { LiveToastMessage } from "@/components/shared/LiveToastMessage";
import { useLanguage } from "@/hooks/useLanguage";
import { createVisit, updateVisit } from "@/service/medicalRecordService";
import { getDoctorsDropdown } from "@/service/doctorService";
import { getApiErrorMessage } from "@/utils/apiError";
import type { MedicalVisit, CreateVisitPayload } from "@/types/medicalRecord";

function buildSchema(t: { medicalRecordVisitDateRequired: string }) {
  return z.object({
    visitDate: z.string().min(1, t.medicalRecordVisitDateRequired),
    chiefComplaint: z.string().trim().optional(),
    diagnosis: z.string().trim().optional(),
    notes: z.string().trim().optional(),
    weightKg: z.string().trim().optional(),
    heightCm: z.string().trim().optional(),
    bloodPressure: z.string().trim().optional(),
    temperatureCelsius: z.string().trim().optional(),
    pulsePerMinute: z.string().trim().optional(),
    doctorUuid: z.string().optional(),
  });
}

type FormValues = z.infer<ReturnType<typeof buildSchema>>;

export interface VisitFormModalProps {
  customerUuid: string;
  visit?: MedicalVisit;
  onClose: () => void;
  onSuccess: () => void;
}

export function VisitFormModal({
  customerUuid,
  visit,
  onClose,
  onSuccess,
}: VisitFormModalProps): JSX.Element {
  const { t, language } = useLanguage();
  const queryClient = useQueryClient();
  const isEdit = Boolean(visit);

  const schema = buildSchema(t);

  function toDateStr(isoStr: string): string {
    return isoStr.substring(0, 10);
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      visitDate: visit ? toDateStr(visit.visitDate) : "",
      chiefComplaint: visit?.chiefComplaint ?? "",
      diagnosis: visit?.diagnosis ?? "",
      notes: visit?.notes ?? "",
      weightKg: visit?.weightKg != null ? String(visit.weightKg) : "",
      heightCm: visit?.heightCm != null ? String(visit.heightCm) : "",
      bloodPressure: visit?.bloodPressure ?? "",
      temperatureCelsius: visit?.temperatureCelsius != null ? String(visit.temperatureCelsius) : "",
      pulsePerMinute: visit?.pulsePerMinute != null ? String(visit.pulsePerMinute) : "",
      doctorUuid: visit?.doctor?.uuid ?? "",
    },
  });

  useEffect(() => {
    form.reset({
      visitDate: visit ? toDateStr(visit.visitDate) : "",
      chiefComplaint: visit?.chiefComplaint ?? "",
      diagnosis: visit?.diagnosis ?? "",
      notes: visit?.notes ?? "",
      weightKg: visit?.weightKg != null ? String(visit.weightKg) : "",
      heightCm: visit?.heightCm != null ? String(visit.heightCm) : "",
      bloodPressure: visit?.bloodPressure ?? "",
      temperatureCelsius: visit?.temperatureCelsius != null ? String(visit.temperatureCelsius) : "",
      pulsePerMinute: visit?.pulsePerMinute != null ? String(visit.pulsePerMinute) : "",
      doctorUuid: visit?.doctor?.uuid ?? "",
    });
  }, [visit, form]);

  const { data: doctorsData } = useQuery({
    queryKey: ["doctors-dropdown"],
    queryFn: () => getDoctorsDropdown(),
    staleTime: 5 * 60 * 1000,
  });

  const doctorOptions = [
    { value: "", label: `— ${t.medicalRecordVisitDoctorPlaceholder} —` },
    ...(doctorsData?.data ?? []).map((d) => ({ value: d.uuid, label: d.name })),
  ];

  const createMutation = useMutation({
    mutationFn: (payload: CreateVisitPayload) => createVisit(customerUuid, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medical-visits", customerUuid] });
      toast.success(
        <LiveToastMessage getMessage={(t) => t.medicalRecordVisitAddSuccess} />
      );
      onSuccess();
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err, language, t.unexpectedError));
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: CreateVisitPayload) =>
      updateVisit(customerUuid, visit!.uuid, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medical-visits", customerUuid] });
      toast.success(
        <LiveToastMessage getMessage={(t) => t.medicalRecordVisitUpdateSuccess} />
      );
      onSuccess();
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err, language, t.unexpectedError));
    },
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  function onSubmit(values: FormValues): void {
    const payload: CreateVisitPayload = {
      visitDate: new Date(values.visitDate).toISOString(),
      chiefComplaint: values.chiefComplaint || undefined,
      diagnosis: values.diagnosis || undefined,
      notes: values.notes || undefined,
      weightKg: values.weightKg ? parseFloat(values.weightKg) : undefined,
      heightCm: values.heightCm ? parseFloat(values.heightCm) : undefined,
      bloodPressure: values.bloodPressure || undefined,
      temperatureCelsius: values.temperatureCelsius ? parseFloat(values.temperatureCelsius) : undefined,
      pulsePerMinute: values.pulsePerMinute ? parseInt(values.pulsePerMinute, 10) : undefined,
      doctorUuid: values.doctorUuid || undefined,
    };

    if (isEdit) {
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload);
    }
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? t.medicalRecordVisitEdit : t.medicalRecordVisitAdd}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Visit Date */}
            <FormField
              control={form.control}
              name="visitDate"
              render={() => (
                <FormItem>
                  <FormLabel>{t.medicalRecordVisitDate}</FormLabel>
                  <FormControl>
                    <Controller
                      control={form.control}
                      name="visitDate"
                      render={({ field }) => (
                        <DateInput
                          value={field.value}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                        />
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Doctor */}
            <FormField
              control={form.control}
              name="doctorUuid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.medicalRecordVisitDoctor}</FormLabel>
                  <FormControl>
                    <Combobox
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                      options={doctorOptions}
                      placeholder={t.medicalRecordVisitDoctorPlaceholder}
                      className="h-10 w-full rounded-xl text-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Chief Complaint */}
            <FormField
              control={form.control}
              name="chiefComplaint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.medicalRecordVisitChiefComplaint}</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder={t.medicalRecordVisitChiefComplaintPlaceholder}
                      rows={2}
                      className="resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Diagnosis */}
            <FormField
              control={form.control}
              name="diagnosis"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.medicalRecordVisitDiagnosis}</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder={t.medicalRecordVisitDiagnosisPlaceholder}
                      rows={2}
                      className="resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.medicalRecordVisitNotes}</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder={t.medicalRecordVisitNotesPlaceholder}
                      rows={2}
                      className="resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Vital Signs */}
            <div className="space-y-3 rounded-xl border border-border bg-muted/20 p-4">
              <p className="text-sm font-semibold text-foreground">
                {t.medicalRecordVisitVitals}
              </p>
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="weightKg"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">{t.medicalRecordVisitWeight}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          step="0.1"
                          placeholder={t.medicalRecordVisitWeightPlaceholder}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="heightCm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">{t.medicalRecordVisitHeight}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          step="0.1"
                          placeholder={t.medicalRecordVisitHeightPlaceholder}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bloodPressure"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">{t.medicalRecordVisitBloodPressure}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={t.medicalRecordVisitBloodPressurePlaceholder}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="temperatureCelsius"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">{t.medicalRecordVisitTemperature}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          step="0.1"
                          placeholder={t.medicalRecordVisitTemperaturePlaceholder}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pulsePerMinute"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">{t.medicalRecordVisitPulse}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder={t.medicalRecordVisitPulsePlaceholder}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isPending}
              >
                {t.cancel}
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t.medicalRecordVisitSaving}
                  </>
                ) : (
                  t.medicalRecordVisitSave
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

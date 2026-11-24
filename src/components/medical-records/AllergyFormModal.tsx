import type { JSX } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { LiveToastMessage } from "@/components/shared/LiveToastMessage";
import { useLanguage } from "@/hooks/useLanguage";
import { addAllergy, updateAllergy } from "@/service/medicalRecordService";
import { getApiErrorMessage } from "@/utils/apiError";
import { cn } from "@/utils/cn";
import type { Allergy, AllergyType, AllergySeverity, CreateAllergyPayload } from "@/types/medicalRecord";
import { SEVERITY_DOT } from "./severity";

const TYPES: AllergyType[] = ["MEDICINE", "FOOD", "ENVIRONMENT", "OTHER"];
const SEVERITIES: AllergySeverity[] = ["MILD", "MODERATE", "SEVERE"];

export interface AllergyFormModalProps {
  customerUuid: string;
  /** Present when editing. */
  allergy?: Allergy;
  onClose: () => void;
  onSuccess: () => void;
}

/** A row of equal-width toggle buttons: fits short enum choices better than a dropdown. */
function Segmented<T extends string>({
  value,
  options,
  onChange,
  invalid,
}: {
  value: T | undefined;
  options: { value: T; label: string; dot?: string }[];
  onChange: (v: T) => void;
  invalid?: boolean;
}): JSX.Element {
  return (
    <div
      role="radiogroup"
      className={cn(
        "grid h-10 gap-1 rounded-xl border bg-muted/40 p-1",
        invalid ? "border-destructive" : "border-input"
      )}
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={cn(
              "flex min-w-0 items-center justify-center gap-1.5 rounded-lg px-2 text-xs font-medium transition-colors",
              active
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {o.dot && <span className={cn("h-2 w-2 shrink-0 rounded-full", o.dot)} aria-hidden />}
            <span className="truncate">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function AllergyFormModal({
  customerUuid,
  allergy,
  onClose,
  onSuccess,
}: AllergyFormModalProps): JSX.Element {
  const { t, language } = useLanguage();
  const queryClient = useQueryClient();
  const isEdit = Boolean(allergy);

  const typeLabels: Record<AllergyType, string> = {
    MEDICINE: t.medicalRecordAllergyTypeMedicine,
    FOOD: t.medicalRecordAllergyTypeFood,
    ENVIRONMENT: t.medicalRecordAllergyTypeEnvironment,
    OTHER: t.medicalRecordAllergyTypeOther,
  };
  const severityLabels: Record<AllergySeverity, string> = {
    MILD: t.medicalRecordAllergySeverityMild,
    MODERATE: t.medicalRecordAllergySeverityModerate,
    SEVERE: t.medicalRecordAllergySeveritySevere,
  };

  const schema = z.object({
    allergenName: z.string().trim().min(1, t.medicalRecordAllergyNameRequired),
    allergenType: z.enum(["MEDICINE", "FOOD", "ENVIRONMENT", "OTHER"], {
      required_error: t.medicalRecordAllergyTypeRequired,
    }),
    severity: z.enum(["MILD", "MODERATE", "SEVERE"], {
      required_error: t.medicalRecordAllergySeverityRequired,
    }),
    reaction: z.string().trim().optional(),
    notes: z.string().trim().optional(),
  });
  type FormValues = z.infer<typeof schema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      allergenName: allergy?.allergenName ?? "",
      allergenType: allergy?.allergenType ?? "MEDICINE",
      severity: allergy?.severity,
      reaction: allergy?.reaction ?? "",
      notes: allergy?.notes ?? "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: CreateAllergyPayload) =>
      allergy ? updateAllergy(customerUuid, allergy.uuid, payload) : addAllergy(customerUuid, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medical-record", customerUuid] });
      toast.success(
        <LiveToastMessage
          getMessage={(t) => (isEdit ? t.medicalRecordAllergyUpdateSuccess : t.medicalRecordAllergyAddSuccess)}
        />
      );
      onSuccess();
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err, language, t.unexpectedError));
    },
  });

  function onSubmit(values: FormValues): void {
    mutate({
      allergenName: values.allergenName,
      allergenType: values.allergenType,
      severity: values.severity,
      // On edit an empty string clears the field; on create it's simply omitted.
      reaction: isEdit ? values.reaction ?? "" : values.reaction || undefined,
      notes: isEdit ? values.notes ?? "" : values.notes || undefined,
    });
  }

  return (
    <Dialog open onOpenChange={(open) => !open && !isPending && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? t.medicalRecordAllergyEdit : t.medicalRecordAllergyAdd}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="allergenName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.medicalRecordAllergyName}</FormLabel>
                  <FormControl>
                    <Input {...field} autoFocus placeholder={t.medicalRecordAllergyNamePlaceholder} className="h-10 rounded-xl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="allergenType"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>{t.medicalRecordAllergyType}</FormLabel>
                  <FormControl>
                    <Segmented
                      value={field.value}
                      onChange={field.onChange}
                      invalid={!!fieldState.error}
                      options={TYPES.map((v) => ({ value: v, label: typeLabels[v] }))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="severity"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>{t.medicalRecordAllergySeverity}</FormLabel>
                  <FormControl>
                    <Segmented
                      value={field.value}
                      onChange={field.onChange}
                      invalid={!!fieldState.error}
                      options={SEVERITIES.map((v) => ({ value: v, label: severityLabels[v], dot: SEVERITY_DOT[v] }))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reaction"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.medicalRecordAllergyReaction}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={t.medicalRecordAllergyReactionPlaceholder} className="h-10 rounded-xl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.medicalRecordAllergyNotes}</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder={t.medicalRecordAllergyNotesPlaceholder}
                      rows={2}
                      className="resize-none rounded-xl"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={isPending} className="rounded-xl">
                {t.cancel}
              </Button>
              <Button type="submit" disabled={isPending} className="rounded-xl">
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t.medicalRecordSaving}
                  </>
                ) : (
                  t.medicalRecordSave
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

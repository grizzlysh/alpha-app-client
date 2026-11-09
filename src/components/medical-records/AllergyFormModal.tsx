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
import { Combobox } from "@/components/ui/combobox";
import { LiveToastMessage } from "@/components/shared/LiveToastMessage";
import { useLanguage } from "@/hooks/useLanguage";
import { addAllergy } from "@/service/medicalRecordService";
import { getApiErrorMessage } from "@/utils/apiError";
import type { AllergyType, AllergySeverity, CreateAllergyPayload } from "@/types/medicalRecord";

const schema = z.object({
  allergenName: z.string().trim().min(1, "required"),
  allergenType: z.enum(["MEDICINE", "FOOD", "ENVIRONMENT", "OTHER"]),
  reaction: z.string().trim().optional(),
  severity: z.enum(["MILD", "MODERATE", "SEVERE"]),
  notes: z.string().trim().optional(),
});

type FormValues = z.infer<typeof schema>;

export interface AllergyFormModalProps {
  customerUuid: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function AllergyFormModal({
  customerUuid,
  onClose,
  onSuccess,
}: AllergyFormModalProps): JSX.Element {
  const { t, language } = useLanguage();

  const allergyTypeOptions = [
    { value: "MEDICINE", label: t.medicalRecordAllergyTypeMedicine },
    { value: "FOOD", label: t.medicalRecordAllergyTypeFood },
    { value: "ENVIRONMENT", label: t.medicalRecordAllergyTypeEnvironment },
    { value: "OTHER", label: t.medicalRecordAllergyTypeOther },
  ];

  const severityOptions = [
    { value: "MILD", label: t.medicalRecordAllergySeverityMild },
    { value: "MODERATE", label: t.medicalRecordAllergySeverityModerate },
    { value: "SEVERE", label: t.medicalRecordAllergySeveritySevere },
  ];

  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(
      schema.extend({
        allergenName: z.string().trim().min(1, t.medicalRecordAllergyNameRequired),
        allergenType: z.enum(["MEDICINE", "FOOD", "ENVIRONMENT", "OTHER"], {
          required_error: t.medicalRecordAllergyTypeRequired,
        }),
        severity: z.enum(["MILD", "MODERATE", "SEVERE"], {
          required_error: t.medicalRecordAllergySeverityRequired,
        }),
      })
    ),
    defaultValues: {
      allergenName: "",
      reaction: "",
      notes: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: CreateAllergyPayload) =>
      addAllergy(customerUuid, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medical-record", customerUuid] });
      toast.success(
        <LiveToastMessage getMessage={(t) => t.medicalRecordAllergyAddSuccess} />
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
      allergenType: values.allergenType as AllergyType,
      reaction: values.reaction || undefined,
      severity: values.severity as AllergySeverity,
      notes: values.notes || undefined,
    });
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t.medicalRecordAllergyAdd}</DialogTitle>
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
                    <Input {...field} placeholder={t.medicalRecordAllergyNamePlaceholder} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="allergenType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.medicalRecordAllergyType}</FormLabel>
                    <FormControl>
                      <Combobox
                        value={field.value ?? ""}
                        onValueChange={field.onChange}
                        options={allergyTypeOptions}
                        placeholder={t.medicalRecordAllergyType}
                        className="h-10 w-full rounded-xl text-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="severity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.medicalRecordAllergySeverity}</FormLabel>
                    <FormControl>
                      <Combobox
                        value={field.value ?? ""}
                        onValueChange={field.onChange}
                        options={severityOptions}
                        placeholder={t.medicalRecordAllergySeverity}
                        className="h-10 w-full rounded-xl text-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="reaction"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.medicalRecordAllergyReaction}</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder={t.medicalRecordAllergyReactionPlaceholder}
                      rows={2}
                      className="resize-none"
                    />
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
                      className="resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

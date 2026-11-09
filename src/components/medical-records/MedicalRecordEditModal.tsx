import type { JSX } from "react";
import { useEffect } from "react";
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
import { LiveToastMessage } from "@/components/shared/LiveToastMessage";
import { useLanguage } from "@/hooks/useLanguage";
import { updateMedicalRecord } from "@/service/medicalRecordService";
import { getApiErrorMessage } from "@/utils/apiError";
import type { MedicalRecord, UpdateMedicalRecordPayload } from "@/types/medicalRecord";

const schema = z.object({
  bloodType: z.string().trim().optional(),
  emergencyContactName: z.string().trim().optional(),
  emergencyContactPhone: z.string().trim().optional(),
});

type FormValues = z.infer<typeof schema>;

export interface MedicalRecordEditModalProps {
  record: MedicalRecord;
  customerUuid: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function MedicalRecordEditModal({
  record,
  customerUuid,
  onClose,
  onSuccess,
}: MedicalRecordEditModalProps): JSX.Element {
  const { t, language } = useLanguage();
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      bloodType: record.bloodType ?? "",
      emergencyContactName: record.emergencyContactName ?? "",
      emergencyContactPhone: record.emergencyContactPhone ?? "",
    },
  });

  useEffect(() => {
    form.reset({
      bloodType: record.bloodType ?? "",
      emergencyContactName: record.emergencyContactName ?? "",
      emergencyContactPhone: record.emergencyContactPhone ?? "",
    });
  }, [record, form]);

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: UpdateMedicalRecordPayload) =>
      updateMedicalRecord(customerUuid, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medical-record", customerUuid] });
      toast.success(
        <LiveToastMessage getMessage={(t) => t.medicalRecordUpdateSuccess} />
      );
      onSuccess();
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err, language, t.unexpectedError));
    },
  });

  function onSubmit(values: FormValues): void {
    const payload: UpdateMedicalRecordPayload = {};
    if (values.bloodType !== undefined) payload.bloodType = values.bloodType;
    if (values.emergencyContactName !== undefined) payload.emergencyContactName = values.emergencyContactName;
    if (values.emergencyContactPhone !== undefined) payload.emergencyContactPhone = values.emergencyContactPhone;
    mutate(payload);
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t.medicalRecordEdit}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="bloodType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.medicalRecordBloodType}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={t.medicalRecordBloodTypePlaceholder}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                {t.medicalRecordEmergencyContact}
              </p>
              <div className="space-y-3 rounded-xl border border-border bg-muted/20 p-3">
                <FormField
                  control={form.control}
                  name="emergencyContactName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-muted-foreground">
                        {t.medicalRecordEmergencyContactName}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={t.medicalRecordEmergencyContactNamePlaceholder}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="emergencyContactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-muted-foreground">
                        {t.medicalRecordEmergencyContactPhone}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={t.medicalRecordEmergencyContactPhonePlaceholder}
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

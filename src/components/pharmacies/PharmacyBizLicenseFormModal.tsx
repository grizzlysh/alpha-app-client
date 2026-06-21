import type { JSX } from "react";
import { useMemo, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { FileKey, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { DateInput } from "@/components/ui/date-input";
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
import type { BusinessLicense, UpdateBusinessLicensePayload } from "@/types/businessLicense";
import {
  createBusinessLicense,
  updateBusinessLicense,
} from "@/service/businessLicenseService";

function makeSchema(t: Translations, isEdit: boolean) {
  const base = z
    .object({
      licenseNumber: z.string().trim().min(1, t.bizLicenseNumberRequired).max(100),
      validFrom: z.string().min(1, t.bizLicenseValidFromRequired),
      validUntil: z.string().min(1, t.bizLicenseValidUntilRequired),
    })
    .refine(
      (d) => !d.validFrom || !d.validUntil || new Date(d.validUntil) > new Date(d.validFrom),
      { message: t.bizLicenseValidUntilAfterFrom, path: ["validUntil"] }
    );
  if (!isEdit) return base;
  return z
    .object({
      licenseNumber: z.string().trim().min(1, t.bizLicenseNumberRequired).max(100),
      validFrom: z.string().min(1, t.bizLicenseValidFromRequired),
      validUntil: z.string().min(1, t.bizLicenseValidUntilRequired),
      status: z.enum(["ACTIVE", "INACTIVE"] as const).optional(),
    })
    .refine(
      (d) => !d.validFrom || !d.validUntil || new Date(d.validUntil) > new Date(d.validFrom),
      { message: t.bizLicenseValidUntilAfterFrom, path: ["validUntil"] }
    );
}

interface FormValues {
  licenseNumber: string;
  validFrom: string;
  validUntil: string;
  status?: "ACTIVE" | "INACTIVE";
}

function toDateInputValue(isoStr: string | null | undefined): string {
  if (!isoStr) return "";
  return new Date(isoStr).toISOString().slice(0, 10);
}

function toISOString(dateStr: string): string {
  if (!dateStr) return "";
  return new Date(dateStr).toISOString();
}

export interface PharmacyBizLicenseFormModalProps {
  mode: "create" | "edit";
  pharmacyUuid: string;
  license?: BusinessLicense;
  onClose: () => void;
  onSuccess: () => void;
}

export function PharmacyBizLicenseFormModal({
  mode,
  pharmacyUuid,
  license,
  onClose,
  onSuccess,
}: PharmacyBizLicenseFormModalProps): JSX.Element {
  const queryClient = useQueryClient();
  const { t, language } = useLanguage();
  const isEdit = mode === "edit";
  const schema = useMemo(() => makeSchema(t, isEdit), [t, isEdit]);
  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      licenseNumber: license?.licenseNumber ?? "",
      validFrom: toDateInputValue(license?.validFrom),
      validUntil: toDateInputValue(license?.validUntil),
      status:
        license?.status === "ACTIVE" || license?.status === "INACTIVE"
          ? license.status
          : undefined,
    },
  });

  function handleMutationError(error: unknown): void {
    toast.error(getApiErrorMessage(error, language, t.unexpectedError));
  }

  const createMutation = useMutation({
    mutationFn: (payload: { licenseNumber: string; validFrom: string; validUntil: string }) =>
      createBusinessLicense({
        pharmacyUuid,
        ...payload,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pharmacy-biz-licenses", pharmacyUuid] });
      queryClient.invalidateQueries({ queryKey: ["pharmacies"] });
      toast.success(t.licenseCreateSuccess);
      onSuccessRef.current();
    },
    onError: handleMutationError,
  });

  const updateMutation = useMutation({
    mutationFn: (payload: UpdateBusinessLicensePayload) =>
      updateBusinessLicense(pharmacyUuid, license!.uuid, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pharmacy-biz-licenses", pharmacyUuid] });
      queryClient.invalidateQueries({ queryKey: ["pharmacies"] });
      toast.success(t.licenseUpdateSuccess);
      onSuccessRef.current();
    },
    onError: handleMutationError,
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  function onSubmit(values: FormValues): void {
    if (!isEdit) {
      createMutation.mutate({
        licenseNumber: values.licenseNumber,
        validFrom: toISOString(values.validFrom),
        validUntil: toISOString(values.validUntil),
      });
    } else if (license) {
      const payload: UpdateBusinessLicensePayload = {};
      if (values.licenseNumber !== license.licenseNumber) payload.licenseNumber = values.licenseNumber;
      const newFrom = toISOString(values.validFrom);
      if (newFrom !== new Date(license.validFrom).toISOString()) payload.validFrom = newFrom;
      const newUntil = toISOString(values.validUntil);
      if (newUntil !== new Date(license.validUntil).toISOString()) payload.validUntil = newUntil;
      if (values.status && values.status !== license.status) payload.status = values.status;
      updateMutation.mutate(payload);
    }
  }

  const fieldError = (key: keyof FormValues) => form.formState.errors[key]?.message;

  return (
    <Dialog open onOpenChange={(open) => { if (!open && !isPending) onClose(); }}>
      <DialogContent
        className="max-w-md p-0"
        onInteractOutside={(e) => { if (isPending) e.preventDefault(); }}
      >
        <DialogHeader className="flex flex-row items-center gap-3 space-y-0 border-b border-border px-6 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
            <FileKey className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0">
            <DialogTitle className="text-base">
              {isEdit ? t.licenseEdit : t.licenseAdd}
            </DialogTitle>
            <p className="text-xs text-muted-foreground">{t.bizLicenseTitle}</p>
          </div>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="max-h-[65vh] overflow-y-auto px-6 py-5">
            <div className="space-y-4">
              {/* License Number */}
              <div className="space-y-1.5">
                <Label htmlFor="biz-license-number">
                  {t.bizLicenseNumber}
                  <span className="ml-0.5 text-destructive">*</span>
                </Label>
                <Controller
                  name="licenseNumber"
                  control={form.control}
                  render={({ field }) => (
                    <Input
                      id="biz-license-number"
                      placeholder={t.bizLicenseNumberPlaceholder}
                      {...field}
                      className={cn(
                        fieldError("licenseNumber") &&
                          "border-destructive focus-visible:ring-destructive/30"
                      )}
                    />
                  )}
                />
                {fieldError("licenseNumber") && (
                  <p className="flex items-center gap-1 text-xs text-destructive"><AlertCircle className="h-3 w-3 shrink-0" />{fieldError("licenseNumber")}</p>
                )}
              </div>

              {/* Valid From */}
              <div className="space-y-1.5">
                <Label htmlFor="biz-license-valid-from">
                  {t.bizLicenseValidFrom}
                  <span className="ml-0.5 text-destructive">*</span>
                </Label>
                <Controller
                  name="validFrom"
                  control={form.control}
                  render={({ field }) => (
                    <DateInput
                      id="biz-license-valid-from"
                      {...field}
                      className={cn(
                        fieldError("validFrom") &&
                          "border-destructive focus-visible:ring-destructive/30"
                      )}
                    />
                  )}
                />
                {fieldError("validFrom") && (
                  <p className="flex items-center gap-1 text-xs text-destructive"><AlertCircle className="h-3 w-3 shrink-0" />{fieldError("validFrom")}</p>
                )}
              </div>

              {/* Valid Until */}
              <div className="space-y-1.5">
                <Label htmlFor="biz-license-valid-until">
                  {t.bizLicenseValidUntil}
                  <span className="ml-0.5 text-destructive">*</span>
                </Label>
                <Controller
                  name="validUntil"
                  control={form.control}
                  render={({ field }) => (
                    <DateInput
                      id="biz-license-valid-until"
                      {...field}
                      className={cn(
                        fieldError("validUntil") &&
                          "border-destructive focus-visible:ring-destructive/30"
                      )}
                    />
                  )}
                />
                {fieldError("validUntil") && (
                  <p className="flex items-center gap-1 text-xs text-destructive"><AlertCircle className="h-3 w-3 shrink-0" />{fieldError("validUntil")}</p>
                )}
              </div>

              {/* Status — edit only */}
              {isEdit && (
                <div className="space-y-1.5">
                  <Label htmlFor="biz-license-status">{t.licenseStatus}</Label>
                  <Controller
                    name="status"
                    control={form.control}
                    render={({ field }) => (
                      <Combobox
                        value={field.value ?? ""}
                        onValueChange={field.onChange}
                        options={[
                          { value: "ACTIVE", label: t.pharmaStatusActive },
                          { value: "INACTIVE", label: t.pharmaStatusInactive },
                        ]}
                      />
                    )}
                  />
                </div>
              )}
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
            <Button type="submit" disabled={isPending} className="min-w-[6rem] rounded-xl">
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> {t.licenseSaving}
                </>
              ) : (
                t.licenseSave
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

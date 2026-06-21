import type { JSX } from "react";
import { useMemo, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { FileText, Loader2, AlertCircle } from "lucide-react";
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
import type {
  PlacementItem,
  LicenseItem,
  CreateLicensePayload,
  UpdateLicensePayload,
} from "@/types/user";
import { addLicense, updateLicense } from "@/service/userService";

function makeSchema(t: Translations, isEdit: boolean) {
  const baseObj = z.object({
    licenseNumber: z.string().trim().min(1, t.licenseNumberRequired).max(100),
    validFrom: z.string().min(1, t.licenseValidFromRequired),
    validUntil: z.string().min(1, t.licenseValidUntilRequired),
    ...(isEdit ? { status: z.enum(["ACTIVE", "INACTIVE"] as const).optional() } : {}),
  });
  return baseObj.refine(
    (d) => !d.validFrom || !d.validUntil || new Date(d.validUntil) > new Date(d.validFrom),
    { message: t.licenseValidUntilAfterFrom, path: ["validUntil"] }
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

export interface UserLicenseFormModalProps {
  mode: "create" | "edit";
  userUuid: string;
  placement: PlacementItem;
  license?: LicenseItem;
  onClose: () => void;
  onSuccess: () => void;
}

export function UserLicenseFormModal({
  mode,
  userUuid,
  placement,
  license,
  onClose,
  onSuccess,
}: UserLicenseFormModalProps): JSX.Element {
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
      status: (license?.status === "ACTIVE" || license?.status === "INACTIVE")
        ? license.status
        : undefined,
    },
  });

  function handleMutationError(error: unknown): void {
    toast.error(getApiErrorMessage(error, language, t.unexpectedError));
  }

  const createMutation = useMutation({
    mutationFn: (payload: CreateLicensePayload) =>
      addLicense(userUuid, placement.uuid, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-placements", userUuid] });
      toast.success(t.licenseCreateSuccess);
      onSuccessRef.current();
    },
    onError: handleMutationError,
  });

  const updateMutation = useMutation({
    mutationFn: ({ licenseUuid, payload }: { licenseUuid: string; payload: UpdateLicensePayload }) =>
      updateLicense(userUuid, placement.uuid, licenseUuid, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-placements", userUuid] });
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
      const payload: UpdateLicensePayload = {};
      if (values.licenseNumber !== license.licenseNumber) payload.licenseNumber = values.licenseNumber;
      const newFrom = toISOString(values.validFrom);
      if (newFrom !== new Date(license.validFrom).toISOString()) payload.validFrom = newFrom;
      const newUntil = toISOString(values.validUntil);
      if (newUntil !== new Date(license.validUntil).toISOString()) payload.validUntil = newUntil;
      if (values.status && values.status !== license.status) payload.status = values.status;
      updateMutation.mutate({ licenseUuid: license.uuid, payload });
    }
  }

  const fieldError = (key: keyof FormValues) =>
    form.formState.errors[key]?.message;

  return (
    <Dialog open onOpenChange={(open) => { if (!open && !isPending) onClose(); }}>
      <DialogContent
        className="max-w-md p-0"
        onInteractOutside={(e) => { if (isPending) e.preventDefault(); }}
      >
        <DialogHeader className="flex flex-row items-center gap-3 space-y-0 border-b border-border px-6 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
            <FileText className="h-4 w-4 text-primary" />
          </div>
          <DialogTitle className="text-base">
            {isEdit ? t.licenseEdit : t.licenseAdd}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="max-h-[65vh] overflow-y-auto px-6 py-5">
            <div className="space-y-4">
              {/* License Number */}
              <div className="space-y-1.5">
                <Label htmlFor="license-number">
                  {t.licenseNumber}
                  <span className="ml-0.5 text-destructive">*</span>
                </Label>
                <Controller
                  name="licenseNumber"
                  control={form.control}
                  render={({ field }) => (
                    <Input
                      id="license-number"
                      placeholder={t.licenseNumberPlaceholder}
                      {...field}
                      className={cn(fieldError("licenseNumber") && "border-destructive focus-visible:ring-destructive/30")}
                    />
                  )}
                />
                {fieldError("licenseNumber") && (
                  <p className="flex items-center gap-1 text-xs text-destructive"><AlertCircle className="h-3 w-3 shrink-0" />{fieldError("licenseNumber")}</p>
                )}
              </div>

              {/* Valid From */}
              <div className="space-y-1.5">
                <Label htmlFor="license-valid-from">
                  {t.licenseValidFrom}
                  <span className="ml-0.5 text-destructive">*</span>
                </Label>
                <Controller
                  name="validFrom"
                  control={form.control}
                  render={({ field }) => (
                    <DateInput
                      id="license-valid-from"
                      {...field}
                      className={cn(fieldError("validFrom") && "border-destructive focus-visible:ring-destructive/30")}
                    />
                  )}
                />
                {fieldError("validFrom") && (
                  <p className="flex items-center gap-1 text-xs text-destructive"><AlertCircle className="h-3 w-3 shrink-0" />{fieldError("validFrom")}</p>
                )}
              </div>

              {/* Valid Until */}
              <div className="space-y-1.5">
                <Label htmlFor="license-valid-until">
                  {t.licenseValidUntil}
                  <span className="ml-0.5 text-destructive">*</span>
                </Label>
                <Controller
                  name="validUntil"
                  control={form.control}
                  render={({ field }) => (
                    <DateInput
                      id="license-valid-until"
                      {...field}
                      className={cn(fieldError("validUntil") && "border-destructive focus-visible:ring-destructive/30")}
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
                  <Label htmlFor="license-status">{t.licenseStatus}</Label>
                  <Controller
                    name="status"
                    control={form.control}
                    render={({ field }) => (
                      <Combobox
                        value={field.value ?? ""}
                        onValueChange={field.onChange}
                        options={[
                          { value: "ACTIVE", label: t.userStatusActive },
                          { value: "INACTIVE", label: t.userStatusInactive },
                        ]}
                      />
                    )}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-border px-6 py-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending} className="rounded-xl">
              {t.cancel}
            </Button>
            <Button type="submit" disabled={isPending} className="min-w-[6rem] rounded-xl">
              {isPending ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> {t.licenseSaving}</>
              ) : t.licenseSave}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

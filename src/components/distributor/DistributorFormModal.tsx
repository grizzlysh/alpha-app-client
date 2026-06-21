import type { JSX } from "react";
import { useMemo, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Truck, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLanguage } from "@/hooks/useLanguage";
import type { Translations } from "@/configs/i18n";
import { getApiErrorMessage } from "@/utils/apiError";
import type { Distributor } from "@/types/distributor";
import { createDistributor, updateDistributor } from "@/service/distributorService";

// ── Schema ────────────────────────────────────────────────────────────────────

function makeSchema(t: Translations) {
  return z.object({
    name: z.string().min(1, t.distributorNameRequired),
    phone: z.string().min(1, t.distributorPhoneRequired),
    address: z.string().min(1, t.distributorAddressRequired),
    email: z
      .string()
      .refine((val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
        message: t.distributorEmailInvalid,
      }),
    contactPerson: z.string(),
    permitNumber: z.string(),
    notes: z.string(),
  });
}

interface FormValues {
  name: string;
  phone: string;
  address: string;
  email: string;
  contactPerson: string;
  permitNumber: string;
  notes: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

export interface DistributorFormModalProps {
  mode: "create" | "edit";
  distributor?: Distributor;
  onClose: () => void;
  onSuccess: () => void;
}

export function DistributorFormModal({
  mode,
  distributor,
  onClose,
  onSuccess,
}: DistributorFormModalProps): JSX.Element {
  const queryClient = useQueryClient();
  const { t, language } = useLanguage();
  const schema = useMemo(() => makeSchema(t), [t]);

  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: distributor?.name ?? "",
      phone: distributor?.phone ?? "",
      address: distributor?.address ?? "",
      email: distributor?.email ?? "",
      contactPerson: distributor?.contactPerson ?? "",
      permitNumber: distributor?.permitNumber ?? "",
      notes: distributor?.description ?? "",
    },
  });

  function handleMutationError(error: unknown): void {
    toast.error(getApiErrorMessage(error, language, t.unexpectedError));
  }

  const createMutation = useMutation({
    mutationFn: createDistributor,
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ["distributors"] });
        onSuccessRef.current();
      } else {
        toast.error(res.message[language]);
      }
    },
    onError: handleMutationError,
  });

  const updateMutation = useMutation({
    mutationFn: ({ uuid, payload }: { uuid: string; payload: FormValues }) =>
      updateDistributor(uuid, {
        name: payload.name,
        phone: payload.phone,
        address: payload.address,
        email: payload.email || undefined,
        contactPerson: payload.contactPerson || undefined,
        permitNumber: payload.permitNumber || undefined,
        description: payload.notes || undefined,
      }),
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ["distributors"] });
        onSuccessRef.current();
      } else {
        toast.error(res.message[language]);
      }
    },
    onError: handleMutationError,
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  function onSubmit(values: FormValues): void {
    const payload = {
      name: values.name,
      phone: values.phone,
      address: values.address,
      email: values.email || undefined,
      contactPerson: values.contactPerson || undefined,
      permitNumber: values.permitNumber || undefined,
      description: values.notes || undefined,
    };
    if (mode === "create") {
      createMutation.mutate(payload);
    } else if (distributor) {
      updateMutation.mutate({ uuid: distributor.uuid, payload: values });
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
        className="max-w-lg p-0"
        onInteractOutside={(e) => {
          if (isPending) e.preventDefault();
        }}
      >
        <DialogHeader className="flex flex-row items-center gap-3 space-y-0 border-b border-border px-6 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
            <Truck className="h-4 w-4 text-primary" />
          </div>
          <DialogTitle className="text-base">
            {mode === "create" ? t.distributorAdd : t.distributorEdit}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="max-h-[65vh] overflow-y-auto px-6 py-5">
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Company name */}
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="dist-name">
                  {t.distributorName}
                  <span className="ml-0.5 text-destructive">*</span>
                </Label>
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <Input
                      id="dist-name"
                      placeholder={t.distributorNamePlaceholder}
                      {...field}
                      className={cn(
                        form.formState.errors.name &&
                          "border-destructive focus-visible:ring-destructive/30"
                      )}
                    />
                  )}
                />
                {form.formState.errors.name && (
                  <p className="flex items-center gap-1 text-xs text-destructive">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

              {/* Contact person */}
              <div className="space-y-1.5">
                <Label htmlFor="dist-contact">
                  {t.distributorContactPerson}
                </Label>
                <Input
                  id="dist-contact"
                  placeholder={t.distributorContactPersonPlaceholder}
                  {...form.register("contactPerson")}
                />
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <Label htmlFor="dist-phone">
                  {t.distributorPhone}
                  <span className="ml-0.5 text-destructive">*</span>
                </Label>
                <Controller
                  name="phone"
                  control={form.control}
                  render={({ field }) => (
                    <Input
                      id="dist-phone"
                      inputMode="tel"
                      placeholder={t.distributorPhonePlaceholder}
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value.replace(/[^\d+\-\s()]/g, "")
                        )
                      }
                      className={cn(
                        form.formState.errors.phone &&
                          "border-destructive focus-visible:ring-destructive/30"
                      )}
                    />
                  )}
                />
                {form.formState.errors.phone && (
                  <p className="flex items-center gap-1 text-xs text-destructive">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    {form.formState.errors.phone.message}
                  </p>
                )}
              </div>

              {/* Permit number */}
              <div className="space-y-1.5">
                <Label htmlFor="dist-permit">
                  {t.distributorPermitNumber}
                </Label>
                <Input
                  id="dist-permit"
                  placeholder={t.distributorPermitNumberPlaceholder}
                  {...form.register("permitNumber")}
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="dist-email">{t.distributorEmail}</Label>
                <Input
                  id="dist-email"
                  inputMode="email"
                  placeholder={t.distributorEmailPlaceholder}
                  {...form.register("email")}
                  className={cn(
                    form.formState.errors.email &&
                      "border-destructive focus-visible:ring-destructive/30"
                  )}
                />
                {form.formState.errors.email && (
                  <p className="flex items-center gap-1 text-xs text-destructive">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              {/* Address */}
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="dist-address">
                  {t.distributorAddress}
                  <span className="ml-0.5 text-destructive">*</span>
                </Label>
                <Input
                  id="dist-address"
                  placeholder={t.distributorAddressPlaceholder}
                  {...form.register("address")}
                  className={cn(
                    form.formState.errors.address &&
                      "border-destructive focus-visible:ring-destructive/30"
                  )}
                />
                {form.formState.errors.address && (
                  <p className="flex items-center gap-1 text-xs text-destructive">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    {form.formState.errors.address.message}
                  </p>
                )}
              </div>

              {/* Notes */}
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="dist-notes">{t.distributorNotes}</Label>
                <Textarea
                  id="dist-notes"
                  rows={3}
                  placeholder={t.distributorNotesPlaceholder}
                  {...form.register("notes")}
                />
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
                  {t.distributorSaving}
                </>
              ) : (
                t.distributorSave
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

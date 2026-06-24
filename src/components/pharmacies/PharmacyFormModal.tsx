import type { JSX } from "react";
import { useMemo, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Hospital, Loader2, AlertCircle } from "lucide-react";
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
import type {
  Pharmacy,
  PharmacyCategory,
  CreatePharmacyPayload,
  UpdatePharmacyPayload,
} from "@/types/pharmacy";
import type { RecordStatus } from "@/types/role";
import { createPharmacy, updatePharmacy } from "@/service/pharmacyService";

function makeSchema(t: Translations, isEdit: boolean) {
  const base = z.object({
    name: z.string().trim().min(1, t.pharmaNameRequired).max(200),
    code: z
      .string()
      .trim()
      .max(5, t.pharmaCodeInvalid)
      .regex(/^[a-zA-Z0-9]*$/, t.pharmaCodeInvalid)
      .optional()
      .or(z.literal("")),
    category: z.enum(
      ["APOTEK", "KLINIK", "RUMAH_SAKIT", "PUSKESMAS"] as const,
      { required_error: t.pharmaCategoryRequired }
    ),
    phone: z.string().trim().min(1, t.pharmaPhoneRequired).max(20),
    address: z.string().trim().min(1, t.pharmaAddressRequired).max(500),
    location: z.string().trim().min(1, t.pharmaLocationRequired).max(200),
    email: z.string().trim().max(200).optional().or(z.literal("")),
  });
  if (!isEdit) return base;
  return base.extend({
    status: z.enum(["ACTIVE", "INACTIVE"] as const).optional(),
  });
}

interface FormValues {
  name: string;
  code?: string;
  category: PharmacyCategory;
  phone: string;
  address: string;
  location: string;
  email?: string;
  status?: RecordStatus;
}

export interface PharmacyFormModalProps {
  mode: "create" | "edit";
  pharmacy?: Pharmacy;
  onClose: () => void;
  onSuccess: () => void;
}

export function PharmacyFormModal({
  mode,
  pharmacy,
  onClose,
  onSuccess,
}: PharmacyFormModalProps): JSX.Element {
  const queryClient = useQueryClient();
  const { t, language } = useLanguage();
  const isEdit = mode === "edit";
  const schema = useMemo(() => makeSchema(t, isEdit), [t, isEdit]);
  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: pharmacy?.name ?? "",
      code: pharmacy?.code ?? "",
      category: pharmacy?.category ?? undefined,
      phone: pharmacy?.phone ?? "",
      address: pharmacy?.address ?? "",
      location: pharmacy?.location ?? "",
      email: pharmacy?.email ?? "",
      status: (pharmacy?.status === "ACTIVE" || pharmacy?.status === "INACTIVE")
        ? pharmacy.status
        : undefined,
    },
  });

  function handleMutationError(error: unknown): void {
    toast.error(getApiErrorMessage(error, language, t.unexpectedError));
  }

  const createMutation = useMutation({
    mutationFn: (payload: CreatePharmacyPayload) => createPharmacy(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pharmacies"] });
      onSuccessRef.current();
    },
    onError: handleMutationError,
  });

  const updateMutation = useMutation({
    mutationFn: ({ uuid, payload }: { uuid: string; payload: UpdatePharmacyPayload }) =>
      updatePharmacy(uuid, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pharmacies"] });
      queryClient.invalidateQueries({ queryKey: ["pharmacy", pharmacy?.uuid] });
      onSuccessRef.current();
    },
    onError: handleMutationError,
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  function onSubmit(values: FormValues): void {
    const email = values.email?.trim() || undefined;
    const code = values.code?.trim() || undefined;

    if (!isEdit) {
      createMutation.mutate({
        name: values.name,
        code,
        category: values.category,
        phone: values.phone,
        address: values.address,
        location: values.location,
        email,
      });
    } else if (pharmacy) {
      const payload: UpdatePharmacyPayload = {};
      if (values.name !== pharmacy.name) payload.name = values.name;
      if (code !== (pharmacy.code ?? undefined)) payload.code = code;
      if (values.category !== pharmacy.category) payload.category = values.category;
      if (values.phone !== pharmacy.phone) payload.phone = values.phone;
      if (values.address !== pharmacy.address) payload.address = values.address;
      if (values.location !== pharmacy.location) payload.location = values.location;
      if (email !== (pharmacy.email ?? undefined)) payload.email = email;
      if (values.status && values.status !== pharmacy.status) payload.status = values.status;
      updateMutation.mutate({ uuid: pharmacy.uuid, payload });
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
            <Hospital className="h-4 w-4 text-primary" />
          </div>
          <DialogTitle className="text-base">
            {isEdit ? t.pharmaEdit : t.pharmaAdd}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="max-h-[65vh] overflow-y-auto px-6 py-5">
            <div className="space-y-4">
              {/* Name */}
              <div className="space-y-1.5">
                <Label htmlFor="pharma-name">
                  {t.pharmaName}
                  <span className="ml-0.5 text-destructive">*</span>
                </Label>
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <Input
                      id="pharma-name"
                      placeholder={t.pharmaNamePlaceholder}
                      {...field}
                      className={cn(fieldError("name") && "border-destructive focus-visible:ring-destructive/30")}
                    />
                  )}
                />
                {fieldError("name") && (
                  <p className="flex items-center gap-1 text-xs text-destructive"><AlertCircle className="h-3 w-3 shrink-0" />{fieldError("name")}</p>
                )}
              </div>

              {/* Code */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="pharma-code">{t.pharmaCode}</Label>
                  <span className="text-xs text-muted-foreground">
                    {(form.watch("code") ?? "").length}/5
                  </span>
                </div>
                <Controller
                  name="code"
                  control={form.control}
                  render={({ field }) => (
                    <Input
                      id="pharma-code"
                      placeholder={t.pharmaCodePlaceholder}
                      maxLength={5}
                      {...field}
                      onChange={(e) => {
                        const sanitized = e.target.value
                          .replace(/[^a-zA-Z0-9]/g, "")
                          .slice(0, 5)
                          .toUpperCase();
                        field.onChange(sanitized);
                      }}
                      className={cn(
                        "font-mono tracking-widest uppercase",
                        fieldError("code") && "border-destructive focus-visible:ring-destructive/30"
                      )}
                    />
                  )}
                />
                {fieldError("code") && (
                  <p className="flex items-center gap-1 text-xs text-destructive"><AlertCircle className="h-3 w-3 shrink-0" />{fieldError("code")}</p>
                )}
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <Label htmlFor="pharma-category">
                  {t.pharmaCategory}
                  <span className="ml-0.5 text-destructive">*</span>
                </Label>
                <Controller
                  name="category"
                  control={form.control}
                  render={({ field }) => (
                    <Combobox
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                      options={[
                        { value: "APOTEK", label: t.pharmaCategoryApotek },
                        { value: "KLINIK", label: t.pharmaCategoryKlinik },
                        { value: "RUMAH_SAKIT", label: t.pharmaCategoryRumahSakit },
                        { value: "PUSKESMAS", label: t.pharmaCategoryPuskesmas },
                      ]}
                      placeholder={t.pharmaSelectCategory}
                      className={cn(fieldError("category") && "border-destructive")}
                    />
                  )}
                />
                {fieldError("category") && (
                  <p className="flex items-center gap-1 text-xs text-destructive"><AlertCircle className="h-3 w-3 shrink-0" />{fieldError("category")}</p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <Label htmlFor="pharma-phone">
                  {t.pharmaPhone}
                  <span className="ml-0.5 text-destructive">*</span>
                </Label>
                <Controller
                  name="phone"
                  control={form.control}
                  render={({ field }) => (
                    <Input
                      id="pharma-phone"
                      placeholder={t.pharmaPhonePlaceholder}
                      {...field}
                      className={cn(fieldError("phone") && "border-destructive focus-visible:ring-destructive/30")}
                    />
                  )}
                />
                {fieldError("phone") && (
                  <p className="flex items-center gap-1 text-xs text-destructive"><AlertCircle className="h-3 w-3 shrink-0" />{fieldError("phone")}</p>
                )}
              </div>

              {/* Address */}
              <div className="space-y-1.5">
                <Label htmlFor="pharma-address">
                  {t.pharmaAddress}
                  <span className="ml-0.5 text-destructive">*</span>
                </Label>
                <Controller
                  name="address"
                  control={form.control}
                  render={({ field }) => (
                    <Input
                      id="pharma-address"
                      placeholder={t.pharmaAddressPlaceholder}
                      {...field}
                      className={cn(fieldError("address") && "border-destructive focus-visible:ring-destructive/30")}
                    />
                  )}
                />
                {fieldError("address") && (
                  <p className="flex items-center gap-1 text-xs text-destructive"><AlertCircle className="h-3 w-3 shrink-0" />{fieldError("address")}</p>
                )}
              </div>

              {/* Location */}
              <div className="space-y-1.5">
                <Label htmlFor="pharma-location">
                  {t.pharmaLocation}
                  <span className="ml-0.5 text-destructive">*</span>
                </Label>
                <Controller
                  name="location"
                  control={form.control}
                  render={({ field }) => (
                    <Input
                      id="pharma-location"
                      placeholder={t.pharmaLocationPlaceholder}
                      {...field}
                      className={cn(fieldError("location") && "border-destructive focus-visible:ring-destructive/30")}
                    />
                  )}
                />
                {fieldError("location") && (
                  <p className="flex items-center gap-1 text-xs text-destructive"><AlertCircle className="h-3 w-3 shrink-0" />{fieldError("location")}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="pharma-email">{t.pharmaEmail}</Label>
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field }) => (
                    <Input
                      id="pharma-email"
                      type="email"
                      placeholder={t.pharmaEmailPlaceholder}
                      {...field}
                    />
                  )}
                />
              </div>

              {/* Status — edit only */}
              {isEdit && (
                <div className="space-y-1.5">
                  <Label htmlFor="pharma-status">{t.pharmaStatus}</Label>
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
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending} className="rounded-xl">
              {t.cancel}
            </Button>
            <Button type="submit" disabled={isPending} className="min-w-[6rem] rounded-xl">
              {isPending ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> {t.pharmaSaving}</>
              ) : t.pharmaSave}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

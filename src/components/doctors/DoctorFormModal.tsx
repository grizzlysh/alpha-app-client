import type { JSX } from "react";
import { useMemo, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Stethoscope, Loader2, AlertCircle } from "lucide-react";

import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
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
import type { Doctor } from "@/types/doctor";
import { createDoctor, updateDoctor } from "@/service/doctorService";

// ── Schema ────────────────────────────────────────────────────────────────────

function makeSchema(t: Translations) {
  return z.object({
    name: z.string().min(1, t.doctorNameRequired),
    licenseNumber: z.string(),
    specialty: z.string(),
    clinicName: z.string(),
    phone: z.string(),
    status: z.enum(["ACTIVE", "INACTIVE"]),
  });
}

interface FormValues {
  name: string;
  licenseNumber: string;
  specialty: string;
  clinicName: string;
  phone: string;
  status: "ACTIVE" | "INACTIVE";
}

// ── Status toggle ─────────────────────────────────────────────────────────────

interface StatusButtonProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

function StatusButton({ label, selected, onClick }: StatusButtonProps): JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex-1 rounded-xl border py-2 text-sm font-medium transition-colors",
        selected
          ? "border-primary bg-primary/10 text-primary"
          : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
      )}
    >
      {label}
    </button>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export interface DoctorFormModalProps {
  mode: "create" | "edit";
  doctor?: Doctor;
  onClose: () => void;
  onSuccess: () => void;
}

export function DoctorFormModal({
  mode,
  doctor,
  onClose,
  onSuccess,
}: DoctorFormModalProps): JSX.Element {
  const queryClient = useQueryClient();
  const { t, language } = useLanguage();
  const schema = useMemo(() => makeSchema(t), [t]);
  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: doctor?.name ?? "",
      licenseNumber: doctor?.licenseNumber ?? "",
      specialty: doctor?.specialty ?? "",
      clinicName: doctor?.clinicName ?? "",
      phone: doctor?.phone ?? "",
      status: doctor?.status ?? "ACTIVE",
    },
  });

  const selectedStatus = form.watch("status");

  function handleMutationError(error: unknown): void {
    toast.error(getApiErrorMessage(error, language, t.unexpectedError));
  }

  const createMutation = useMutation({
    mutationFn: createDoctor,
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ["doctors"] });
        queryClient.invalidateQueries({ queryKey: ["doctors-dropdown"] });
        onSuccessRef.current();
      } else {
        toast.error(res.message[language]);
      }
    },
    onError: handleMutationError,
  });

  const updateMutation = useMutation({
    mutationFn: ({ uuid, payload }: { uuid: string; payload: FormValues }) =>
      updateDoctor(uuid, {
        name: payload.name,
        licenseNumber: payload.licenseNumber || null,
        specialty: payload.specialty || null,
        clinicName: payload.clinicName || null,
        phone: payload.phone || null,
        status: payload.status,
      }),
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ["doctors"] });
        queryClient.invalidateQueries({ queryKey: ["doctors-dropdown"] });
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
        name: values.name,
        licenseNumber: values.licenseNumber || undefined,
        specialty: values.specialty || undefined,
        clinicName: values.clinicName || undefined,
        phone: values.phone || undefined,
      });
    } else if (doctor) {
      updateMutation.mutate({ uuid: doctor.uuid, payload: values });
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
            <Stethoscope className="h-4 w-4 text-primary" />
          </div>
          <DialogTitle className="text-base">
            {mode === "create" ? t.doctorAdd : t.doctorEdit}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="max-h-[65vh] overflow-y-auto px-6 py-5">
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Name */}
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="doc-name">
                  {t.doctorName}
                  <span className="ml-0.5 text-destructive">*</span>
                </Label>
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <Input
                      id="doc-name"
                      placeholder={t.doctorNamePlaceholder}
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

              {/* License Number */}
              <div className="space-y-1.5">
                <Label htmlFor="doc-license">{t.doctorLicenseNumber}</Label>
                <Input
                  id="doc-license"
                  placeholder={t.doctorLicenseNumberPlaceholder}
                  {...form.register("licenseNumber")}
                />
              </div>

              {/* Specialty */}
              <div className="space-y-1.5">
                <Label htmlFor="doc-specialty">{t.doctorSpecialty}</Label>
                <Input
                  id="doc-specialty"
                  placeholder={t.doctorSpecialtyPlaceholder}
                  {...form.register("specialty")}
                />
              </div>

              {/* Clinic Name */}
              <div className="space-y-1.5">
                <Label htmlFor="doc-clinic">{t.doctorClinicName}</Label>
                <Input
                  id="doc-clinic"
                  placeholder={t.doctorClinicNamePlaceholder}
                  {...form.register("clinicName")}
                />
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <Label htmlFor="doc-phone">{t.doctorPhone}</Label>
                <Controller
                  name="phone"
                  control={form.control}
                  render={({ field }) => (
                    <Input
                      id="doc-phone"
                      inputMode="tel"
                      placeholder={t.doctorPhonePlaceholder}
                      {...field}
                      onChange={(e) =>
                        field.onChange(e.target.value.replace(/[^\d+\-\s()]/g, ""))
                      }
                    />
                  )}
                />
              </div>

              {/* Status — edit mode only */}
              {mode === "edit" && (
                <div className="space-y-1.5 sm:col-span-2">
                  <Label>{t.doctorStatusLabel}</Label>
                  <div className="flex gap-2">
                    <StatusButton
                      label={t.doctorStatusActive}
                      selected={selectedStatus === "ACTIVE"}
                      onClick={() => form.setValue("status", "ACTIVE")}
                    />
                    <StatusButton
                      label={t.doctorStatusInactive}
                      selected={selectedStatus === "INACTIVE"}
                      onClick={() => form.setValue("status", "INACTIVE")}
                    />
                  </div>
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
            <Button
              type="submit"
              disabled={isPending}
              className="min-w-[6rem] rounded-xl"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t.doctorSaving}
                </>
              ) : (
                t.doctorSave
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

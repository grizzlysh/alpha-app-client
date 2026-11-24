import type { JSX } from "react";
import { useMemo, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { UserRound, Loader2, AlertCircle } from "lucide-react";

import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DateInput } from "@/components/ui/date-input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLanguage } from "@/hooks/useLanguage";
import type { Translations } from "@/configs/i18n";
import { getApiErrorMessage } from "@/utils/apiError";
import type { Patient, PartyType, Gender } from "@/types/patient";
import { createPatient, updatePatient } from "@/service/patientService";

// ── Schema ────────────────────────────────────────────────────────────────────

function makeSchema(t: Translations) {
  return z.object({
    partyType: z.enum(["PATIENT", "PROFESSIONAL"]),
    name: z.string().min(1, t.patientNameRequired),
    phone: z.string(),
    address: z.string(),
    description: z.string(),
    status: z.enum(["ACTIVE", "INACTIVE"]),
    // patient detail
    nik: z.string(),
    gender: z.enum(["MALE", "FEMALE", ""]),
    dateOfBirth: z.string(),
    bpjsNumber: z.string(),
    // professional detail
    strNumber: z.string(),
    sipNumber: z.string(),
    profession: z.string(),
  });
}

interface FormValues {
  partyType: PartyType;
  name: string;
  phone: string;
  address: string;
  description: string;
  status: "ACTIVE" | "INACTIVE";
  nik: string;
  gender: Gender | "";
  dateOfBirth: string;
  bpjsNumber: string;
  strNumber: string;
  sipNumber: string;
  profession: string;
}

// ── Toggle button (partyType / status) ───────────────────────────────────────

interface ToggleButtonProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

function ToggleButton({ label, selected, onClick, disabled }: ToggleButtonProps): JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex-1 rounded-xl border py-2 text-sm font-medium transition-colors",
        selected
          ? "border-primary bg-primary/10 text-primary"
          : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground",
        disabled && "cursor-not-allowed opacity-50"
      )}
    >
      {label}
    </button>
  );
}

// ── Section divider ───────────────────────────────────────────────────────────

function SectionDivider({ title }: { title: string }): JSX.Element {
  return (
    <div className="flex items-center gap-3 pt-2 sm:col-span-2">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </span>
      <div className="flex-1 border-t border-border" />
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export interface PatientFormModalProps {
  mode: "create" | "edit";
  patient?: Patient;
  onClose: () => void;
  onSuccess: () => void;
}

export function PatientFormModal({
  mode,
  patient,
  onClose,
  onSuccess,
}: PatientFormModalProps): JSX.Element {
  const queryClient = useQueryClient();
  const { t, language } = useLanguage();
  const schema = useMemo(() => makeSchema(t), [t]);

  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      partyType: patient?.partyType ?? "PATIENT",
      name: patient?.name ?? "",
      phone: patient?.phone ?? "",
      address: patient?.address ?? "",
      description: patient?.description ?? "",
      status: patient?.status ?? "ACTIVE",
      nik: patient?.patientDetail?.nik ?? "",
      gender: patient?.patientDetail?.gender ?? "",
      dateOfBirth: patient?.patientDetail?.dateOfBirth
        ? patient.patientDetail.dateOfBirth.substring(0, 10)
        : "",
      bpjsNumber: patient?.patientDetail?.bpjsNumber ?? "",
      strNumber: patient?.professionalDetail?.strNumber ?? "",
      sipNumber: patient?.professionalDetail?.sipNumber ?? "",
      profession: patient?.professionalDetail?.profession ?? "",
    },
  });

  const selectedStatus = form.watch("status");
  const selectedPartyType = form.watch("partyType");

  type UpdatePayload = Parameters<typeof updatePatient>[1];

  function handleMutationError(error: unknown): void {
    toast.error(getApiErrorMessage(error, language, t.unexpectedError));
  }

  const createMutation = useMutation({
    mutationFn: createPatient,
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ["patients"] });
        queryClient.invalidateQueries({ queryKey: ["patients-dropdown"] });
        onSuccessRef.current();
      } else {
        toast.error(res.message[language]);
      }
    },
    onError: handleMutationError,
  });

  const updateMutation = useMutation({
    mutationFn: ({ uuid, payload }: { uuid: string; payload: UpdatePayload }) =>
      updatePatient(uuid, payload),
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ["patients"] });
        queryClient.invalidateQueries({ queryKey: ["patients-dropdown"] });
        onSuccessRef.current();
      } else {
        toast.error(res.message[language]);
      }
    },
    onError: handleMutationError,
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  function buildPatientDetail(values: FormValues) {
    if (
      !values.nik &&
      !values.gender &&
      !values.dateOfBirth &&
      !values.bpjsNumber
    ) {
      return undefined;
    }
    return {
      nik: values.nik || undefined,
      gender: (values.gender as Gender) || undefined,
      dateOfBirth: values.dateOfBirth
        ? new Date(values.dateOfBirth).toISOString()
        : undefined,
      bpjsNumber: values.bpjsNumber || undefined,
    };
  }

  function buildProfessionalDetail(values: FormValues) {
    if (!values.strNumber && !values.sipNumber && !values.profession) {
      return undefined;
    }
    return {
      strNumber: values.strNumber || undefined,
      sipNumber: values.sipNumber || undefined,
      profession: values.profession || undefined,
    };
  }

  function onSubmit(values: FormValues): void {
    if (mode === "create") {
      createMutation.mutate({
        partyType: values.partyType,
        name: values.name,
        phone: values.phone || undefined,
        address: values.address || undefined,
        description: values.description || undefined,
        patientDetail: values.partyType === "PATIENT" ? buildPatientDetail(values) : undefined,
        professionalDetail: values.partyType === "PROFESSIONAL" ? buildProfessionalDetail(values) : undefined,
      });
    } else if (patient) {
      updateMutation.mutate({
        uuid: patient.uuid,
        payload: {
          name: values.name,
          phone: values.phone || undefined,
          address: values.address || undefined,
          description: values.description || undefined,
          status: values.status,
          patientDetail: patient.partyType === "PATIENT" ? buildPatientDetail(values) : undefined,
          professionalDetail: patient.partyType === "PROFESSIONAL" ? buildProfessionalDetail(values) : undefined,
        },
      });
    }
  }

  const isPatient = selectedPartyType === "PATIENT";
  const isProfessional = selectedPartyType === "PROFESSIONAL";

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
            <UserRound className="h-4 w-4 text-primary" />
          </div>
          <DialogTitle className="text-base">
            {mode === "create" ? t.patientAdd : t.patientEdit}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="max-h-[65vh] overflow-y-auto px-6 py-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Party type — create mode only */}
              {mode === "create" && (
                <div className="space-y-1.5 sm:col-span-2">
                  <Label>{t.patientFilterPartyType}</Label>
                  <div className="flex gap-2">
                    <ToggleButton
                      label={t.patientPartyTypePatient}
                      selected={selectedPartyType === "PATIENT"}
                      onClick={() => form.setValue("partyType", "PATIENT")}
                    />
                    <ToggleButton
                      label={t.patientPartyTypeProfessional}
                      selected={selectedPartyType === "PROFESSIONAL"}
                      onClick={() => form.setValue("partyType", "PROFESSIONAL")}
                    />
                  </div>
                </div>
              )}

              {/* Name */}
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="party-name">
                  {t.patientName}
                  <span className="ml-0.5 text-destructive">*</span>
                </Label>
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <Input
                      id="party-name"
                      placeholder={t.patientNamePlaceholder}
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

              {/* Phone */}
              <div className={cn("space-y-1.5", mode === "create" && "sm:col-span-2")}>
                <Label htmlFor="party-phone">{t.patientPhone}</Label>
                <Controller
                  name="phone"
                  control={form.control}
                  render={({ field }) => (
                    <Input
                      id="party-phone"
                      inputMode="tel"
                      placeholder={t.patientPhonePlaceholder}
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
                <div className="space-y-1.5">
                  <Label>{t.patientStatusLabel}</Label>
                  <div className="flex gap-2">
                    <ToggleButton
                      label={t.patientStatusActive}
                      selected={selectedStatus === "ACTIVE"}
                      onClick={() => form.setValue("status", "ACTIVE")}
                    />
                    <ToggleButton
                      label={t.patientStatusInactive}
                      selected={selectedStatus === "INACTIVE"}
                      onClick={() => form.setValue("status", "INACTIVE")}
                    />
                  </div>
                </div>
              )}

              {/* Address */}
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="party-address">{t.patientAddress}</Label>
                <Input
                  id="party-address"
                  placeholder={t.patientAddressPlaceholder}
                  {...form.register("address")}
                />
              </div>

              {/* Notes */}
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="party-notes">{t.patientDescription}</Label>
                <Textarea
                  id="party-notes"
                  rows={3}
                  placeholder={t.patientDescriptionPlaceholder}
                  className="resize-none"
                  {...form.register("description")}
                />
              </div>

              {/* Patient detail fields */}
              {isPatient && (
                <>
                  <SectionDivider title={t.patientDetailSectionTitle} />

                  {/* NIK */}
                  <div className="space-y-1.5">
                    <Label htmlFor="party-nik">{t.patientNik}</Label>
                    <Input
                      id="party-nik"
                      placeholder={t.patientNikPlaceholder}
                      {...form.register("nik")}
                    />
                  </div>

                  {/* Date of Birth */}
                  <div className="space-y-1.5">
                    <Label htmlFor="party-dob">{t.patientDateOfBirth}</Label>
                    <Controller
                      name="dateOfBirth"
                      control={form.control}
                      render={({ field }) => (
                        <DateInput
                          id="party-dob"
                          value={field.value}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          disabled={isPending}
                          placeholder={t.patientDateOfBirth}
                          className="rounded-xl"
                        />
                      )}
                    />
                  </div>

                  {/* Gender */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label>{t.patientGender}</Label>
                    <Controller
                      name="gender"
                      control={form.control}
                      render={({ field }) => (
                        <div className="flex gap-2">
                          <ToggleButton
                            label={t.patientGenderMale}
                            selected={field.value === "MALE"}
                            onClick={() => field.onChange(field.value === "MALE" ? "" : "MALE")}
                          />
                          <ToggleButton
                            label={t.patientGenderFemale}
                            selected={field.value === "FEMALE"}
                            onClick={() => field.onChange(field.value === "FEMALE" ? "" : "FEMALE")}
                          />
                        </div>
                      )}
                    />
                  </div>

                  {/* BPJS Number */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="party-bpjs">{t.patientBpjsNumber}</Label>
                    <Input
                      id="party-bpjs"
                      placeholder={t.patientBpjsNumberPlaceholder}
                      {...form.register("bpjsNumber")}
                    />
                  </div>
                </>
              )}

              {/* Professional detail fields */}
              {isProfessional && (
                <>
                  <SectionDivider title={t.professionalDetailSectionTitle} />

                  {/* Profession */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="party-profession">{t.professionalProfession}</Label>
                    <Input
                      id="party-profession"
                      placeholder={t.professionalProfessionPlaceholder}
                      {...form.register("profession")}
                    />
                  </div>

                  {/* STR Number */}
                  <div className="space-y-1.5">
                    <Label htmlFor="party-str">{t.professionalStrNumber}</Label>
                    <Input
                      id="party-str"
                      placeholder={t.professionalStrNumberPlaceholder}
                      {...form.register("strNumber")}
                    />
                  </div>

                  {/* SIP Number */}
                  <div className="space-y-1.5">
                    <Label htmlFor="party-sip">{t.professionalSipNumber}</Label>
                    <Input
                      id="party-sip"
                      placeholder={t.professionalSipNumberPlaceholder}
                      {...form.register("sipNumber")}
                    />
                  </div>
                </>
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
                  {t.patientSaving}
                </>
              ) : (
                t.patientSave
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

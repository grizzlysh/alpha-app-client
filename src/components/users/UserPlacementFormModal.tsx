import type { JSX } from "react";
import { useMemo, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Check, Hospital, Loader2, AlertCircle } from "lucide-react";
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
  CreatePlacementPayload,
  UpdatePlacementPayload,
} from "@/types/user";
import type { RoleDdlItem } from "@/types/role";
import { createPlacement, updatePlacement } from "@/service/userService";
import { getPharmaciesDdl } from "@/service/pharmacyService";
import { getRolesDdl } from "@/service/roleService";

// ── Helpers ────────────────────────────────────────────────────────────────────

function toDateInputValue(isoStr: string | null | undefined): string {
  if (!isoStr) return "";
  return new Date(isoStr).toISOString().slice(0, 10);
}

function toISOString(dateStr: string): string {
  if (!dateStr) return "";
  return new Date(dateStr).toISOString();
}

// ── StepIndicator ──────────────────────────────────────────────────────────────

const STEP_COUNT = 2;

interface StepIndicatorProps {
  current: 1 | 2;
  labels: [string, string];
}

function StepIndicator({ current, labels }: StepIndicatorProps): JSX.Element {
  return (
    <div className="px-6 pb-5 pt-3">
      <div className="relative mb-2.5">
        <div className="pointer-events-none absolute inset-x-[25%] top-3.5">
          <div className={cn("h-px w-full transition-colors duration-300", current >= 2 ? "bg-primary" : "bg-border")} />
        </div>
        <div className="flex">
          {Array.from({ length: STEP_COUNT }, (_, i) => {
            const n = (i + 1) as 1 | 2;
            const done = n < current;
            const active = n === current;
            return (
              <div key={n} className="relative z-10 flex flex-1 justify-center">
                <div
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ring-2 transition-all duration-300",
                    done
                      ? "bg-primary text-primary-foreground ring-primary"
                      : active
                        ? "bg-primary text-primary-foreground ring-primary/30"
                        : "bg-background text-muted-foreground ring-border"
                  )}
                >
                  {done ? <Check className="h-3.5 w-3.5" /> : n}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex">
        {labels.map((label, i) => {
          const n = (i + 1) as 1 | 2;
          const done = n < current;
          const active = n === current;
          return (
            <div key={i} className="flex flex-1 justify-center px-1">
              <span
                className={cn(
                  "text-center text-xs leading-tight transition-colors",
                  active
                    ? "font-semibold text-foreground"
                    : done
                      ? "font-medium text-primary"
                      : "text-muted-foreground"
                )}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── FieldError ─────────────────────────────────────────────────────────────────

function FieldError({ message }: { message?: string }): JSX.Element | null {
  if (!message) return null;
  return (
    <p className="flex items-center gap-1 text-xs text-destructive">
      <AlertCircle className="h-3 w-3 shrink-0" />
      {message}
    </p>
  );
}

// ── Step 1: Placement Info ─────────────────────────────────────────────────────

interface Step1Values {
  pharmacyUuid: string;
  roleUuid: string;
  joinedAt: string;
}

function makeStep1Schema(t: Translations) {
  return z.object({
    pharmacyUuid: z.string().min(1, t.placementPharmacyRequired),
    roleUuid: z.string().min(1, t.placementRoleRequired),
    joinedAt: z.string().min(1, t.placementJoinedAtRequired),
  });
}

interface Step1FormProps {
  t: Translations;
  defaultValues: Step1Values;
  pharmacies: { uuid: string; name: string; code: string }[];
  roles: RoleDdlItem[];
  onCancel: () => void;
  onNext: (values: Step1Values, requiresLicense: boolean) => void;
}

function Step1Form({ t, defaultValues, pharmacies, roles, onCancel, onNext }: Step1FormProps): JSX.Element {
  const schema = useMemo(() => makeStep1Schema(t), [t]);
  const form = useForm<Step1Values>({ resolver: zodResolver(schema), defaultValues });
  const err = (k: keyof Step1Values) => form.formState.errors[k]?.message;

  function handleSubmit(values: Step1Values): void {
    const selectedRole = roles.find((r) => r.uuid === values.roleUuid);
    onNext(values, selectedRole?.requiresLicense ?? false);
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col">
      <div className="px-6 pb-1 pt-0">
        <p className="text-xs text-muted-foreground">{t.placementWizardStep1Hint}</p>
      </div>

      <div className="max-h-[45vh] overflow-y-auto px-6 py-4">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="w-pharmacy">
              {t.placementPharmacy}<span className="ml-0.5 text-destructive">*</span>
            </Label>
            <Controller
              name="pharmacyUuid"
              control={form.control}
              render={({ field }) => (
                <Combobox
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                  options={pharmacies.map((p) => ({ value: p.uuid, label: `${p.name.toUpperCase()} (${p.code})` }))}
                  placeholder={t.placementSelectPharmacy}
                  className={cn(err("pharmacyUuid") && "border-destructive")}
                />
              )}
            />
            <FieldError message={err("pharmacyUuid")} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="w-role">
              {t.placementRole}<span className="ml-0.5 text-destructive">*</span>
            </Label>
            <Controller
              name="roleUuid"
              control={form.control}
              render={({ field }) => (
                <Combobox
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                  options={roles.map((r) => ({ value: r.uuid, label: r.name }))}
                  placeholder={t.placementSelectRole}
                  className={cn(err("roleUuid") && "border-destructive")}
                />
              )}
            />
            <FieldError message={err("roleUuid")} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="w-joined-at">
              {t.placementJoinedAt}<span className="ml-0.5 text-destructive">*</span>
            </Label>
            <Controller
              name="joinedAt"
              control={form.control}
              render={({ field }) => (
                <DateInput
                  id="w-joined-at"
                  {...field}
                  className={cn(err("joinedAt") && "border-destructive focus-visible:ring-destructive/30")}
                />
              )}
            />
            <FieldError message={err("joinedAt")} />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 border-t border-border px-6 py-4">
        <Button type="button" variant="outline" onClick={onCancel} className="rounded-xl">
          {t.cancel}
        </Button>
        <Button type="submit" className="min-w-[7rem] rounded-xl">
          {t.wizardNext}
        </Button>
      </div>
    </form>
  );
}

// ── Step 2: Practice License ───────────────────────────────────────────────────

interface Step2Values {
  licenseNumber: string;
  validFrom: string;
  validUntil: string;
}

function makeStep2Schema(t: Translations, required: boolean) {
  return z
    .object({
      licenseNumber: required
        ? z.string().trim().min(1, t.licenseNumberRequired).max(100)
        : z.string().trim().max(100).optional().or(z.literal("")),
      validFrom: required
        ? z.string().min(1, t.licenseValidFromRequired)
        : z.string().optional().or(z.literal("")),
      validUntil: required
        ? z.string().min(1, t.licenseValidUntilRequired)
        : z.string().optional().or(z.literal("")),
    })
    .refine(
      (d) => !d.validFrom || !d.validUntil || new Date(d.validUntil) > new Date(d.validFrom),
      { message: t.licenseValidUntilAfterFrom, path: ["validUntil"] }
    );
}

interface Step2FormProps {
  t: Translations;
  isPending: boolean;
  requiresLicense: boolean;
  onBack: () => void;
  onSubmit: (values: Step2Values) => void;
  onSkip: () => void;
}

function Step2Form({ t, isPending, requiresLicense, onBack, onSubmit, onSkip }: Step2FormProps): JSX.Element {
  const schema = useMemo(() => makeStep2Schema(t, requiresLicense), [t, requiresLicense]);
  const form = useForm<Step2Values>({
    resolver: zodResolver(schema),
    defaultValues: { licenseNumber: "", validFrom: "", validUntil: "" },
  });
  const err = (k: keyof Step2Values) => form.formState.errors[k]?.message;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
      <div className="px-6 pb-1 pt-0">
        <p className="text-xs text-muted-foreground">{t.placementWizardStep2Hint}</p>
      </div>

      <div className="max-h-[45vh] overflow-y-auto px-6 py-4">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="w-license-number">
              {t.licenseNumber}
              {requiresLicense && <span className="ml-0.5 text-destructive">*</span>}
            </Label>
            <Controller
              name="licenseNumber"
              control={form.control}
              render={({ field }) => (
                <Input
                  id="w-license-number"
                  placeholder={t.licenseNumberPlaceholder}
                  {...field}
                  className={cn(err("licenseNumber") && "border-destructive focus-visible:ring-destructive/30")}
                />
              )}
            />
            <FieldError message={err("licenseNumber")} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="w-valid-from">
              {t.licenseValidFrom}
              {requiresLicense && <span className="ml-0.5 text-destructive">*</span>}
            </Label>
            <Controller
              name="validFrom"
              control={form.control}
              render={({ field }) => (
                <DateInput
                  id="w-valid-from"
                  {...field}
                  className={cn(err("validFrom") && "border-destructive focus-visible:ring-destructive/30")}
                />
              )}
            />
            <FieldError message={err("validFrom")} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="w-valid-until">
              {t.licenseValidUntil}
              {requiresLicense && <span className="ml-0.5 text-destructive">*</span>}
            </Label>
            <Controller
              name="validUntil"
              control={form.control}
              render={({ field }) => (
                <DateInput
                  id="w-valid-until"
                  {...field}
                  className={cn(err("validUntil") && "border-destructive focus-visible:ring-destructive/30")}
                />
              )}
            />
            <FieldError message={err("validUntil")} />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 border-t border-border px-6 py-4">
        <Button type="button" variant="outline" onClick={onBack} disabled={isPending} className="rounded-xl">
          {t.wizardBack}
        </Button>
        {!requiresLicense && (
          <Button type="button" variant="outline" onClick={onSkip} disabled={isPending} className="rounded-xl">
            {t.wizardSkip}
          </Button>
        )}
        <Button type="submit" disabled={isPending} className="min-w-[7.5rem] rounded-xl">
          {isPending
            ? <><Loader2 className="h-4 w-4 animate-spin" /> {t.placementSaving}</>
            : t.placementSave}
        </Button>
      </div>
    </form>
  );
}

// ── PlacementCreateWizard ──────────────────────────────────────────────────────

interface PlacementCreateWizardProps {
  userUuid: string;
  onClose: () => void;
  onSuccess: () => void;
}

function PlacementCreateWizard({ userUuid, onClose, onSuccess }: PlacementCreateWizardProps): JSX.Element {
  const queryClient = useQueryClient();
  const { t, language } = useLanguage();
  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  const [step, setStep] = useState<1 | 2>(1);
  const [step1Data, setStep1Data] = useState<Step1Values>({ pharmacyUuid: "", roleUuid: "", joinedAt: "" });
  const [licenseRequired, setLicenseRequired] = useState(false);

  const { data: pharmaciesData } = useQuery({
    queryKey: ["pharmacies-ddl"],
    queryFn: () => getPharmaciesDdl(),
  });
  const { data: rolesData } = useQuery({
    queryKey: ["roles-ddl"],
    queryFn: () => getRolesDdl(),
  });
  const pharmacies = pharmaciesData?.data ?? [];
  const roles: RoleDdlItem[] = rolesData?.data ?? [];

  const createMutation = useMutation({
    mutationFn: (payload: CreatePlacementPayload) => createPlacement(userUuid, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-placements", userUuid] });
      toast.success(t.placementCreateSuccess);
      onSuccessRef.current();
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, language, t.unexpectedError));
    },
  });

  function handleStep1(values: Step1Values, requiresLicense: boolean): void {
    setStep1Data(values);
    setLicenseRequired(requiresLicense);
    setStep(2);
  }

  function submit(licenseValues: Step2Values | null): void {
    const license =
      licenseValues?.licenseNumber?.trim()
        ? {
            licenseNumber: licenseValues.licenseNumber.trim(),
            validFrom: toISOString(licenseValues.validFrom),
            validUntil: toISOString(licenseValues.validUntil),
          }
        : undefined;
    createMutation.mutate({
      pharmacyUuid: step1Data.pharmacyUuid,
      roleUuid: step1Data.roleUuid,
      joinedAt: toISOString(step1Data.joinedAt),
      license,
    });
  }

  const stepLabels: [string, string] = [t.placementWizardStep1, t.placementWizardStep2];

  return (
    <Dialog open onOpenChange={(open) => { if (!open && !createMutation.isPending) onClose(); }}>
      <DialogContent
        className="max-w-md p-0"
        onInteractOutside={(e) => { if (createMutation.isPending) e.preventDefault(); }}
      >
        <DialogHeader className="flex flex-row items-center gap-3 space-y-0 border-b border-border px-6 py-4">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <Hospital className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <DialogTitle className="text-base">{t.placementAdd}</DialogTitle>
            <p className="text-xs text-muted-foreground">
              {stepLabels[step - 1]} — {step} / {STEP_COUNT}
            </p>
          </div>
        </DialogHeader>

        <StepIndicator current={step} labels={stepLabels} />

        {step === 1 && (
          <Step1Form
            t={t}
            defaultValues={step1Data}
            pharmacies={pharmacies}
            roles={roles}
            onCancel={onClose}
            onNext={handleStep1}
          />
        )}
        {step === 2 && (
          <Step2Form
            t={t}
            isPending={createMutation.isPending}
            requiresLicense={licenseRequired}
            onBack={() => setStep(1)}
            onSubmit={submit}
            onSkip={() => submit(null)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

// ── PlacementEditForm ──────────────────────────────────────────────────────────

function makeEditSchema(t: Translations) {
  return z
    .object({
      roleUuid: z.string().min(1, t.placementRoleRequired),
      joinedAt: z.string().min(1, t.placementJoinedAtRequired),
      leftAt: z.string().optional().or(z.literal("")),
      status: z.enum(["ACTIVE", "INACTIVE"] as const).optional(),
    })
    .refine(
      (d) => !d.joinedAt || !d.leftAt || new Date(d.leftAt) > new Date(d.joinedAt),
      { message: t.placementLeftAtAfterJoinedAt, path: ["leftAt"] }
    );
}

interface EditFormValues {
  roleUuid: string;
  joinedAt: string;
  leftAt?: string;
  status?: "ACTIVE" | "INACTIVE";
}

interface PlacementEditFormProps {
  userUuid: string;
  placement: PlacementItem;
  onClose: () => void;
  onSuccess: () => void;
}

function PlacementEditForm({ userUuid, placement, onClose, onSuccess }: PlacementEditFormProps): JSX.Element {
  const queryClient = useQueryClient();
  const { t, language } = useLanguage();
  const schema = useMemo(() => makeEditSchema(t), [t]);
  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  const { data: rolesData } = useQuery({
    queryKey: ["roles-ddl"],
    queryFn: () => getRolesDdl(),
  });
  const roles: RoleDdlItem[] = rolesData?.data ?? [];

  const form = useForm<EditFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      roleUuid: placement.role.uuid,
      joinedAt: toDateInputValue(placement.joinedAt),
      leftAt: toDateInputValue(placement.leftAt),
      status: (placement.status === "ACTIVE" || placement.status === "INACTIVE")
        ? placement.status
        : undefined,
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: UpdatePlacementPayload) => updatePlacement(userUuid, placement.uuid, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-placements", userUuid] });
      toast.success(t.placementUpdateSuccess);
      onSuccessRef.current();
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, language, t.unexpectedError));
    },
  });

  function onSubmit(values: EditFormValues): void {
    const payload: UpdatePlacementPayload = {};
    if (values.roleUuid !== placement.role.uuid) payload.roleUuid = values.roleUuid;
    const newJoined = toISOString(values.joinedAt);
    if (newJoined !== new Date(placement.joinedAt).toISOString()) payload.joinedAt = newJoined;
    const newLeft = values.leftAt ? toISOString(values.leftAt) : null;
    const existingLeft = placement.leftAt ? new Date(placement.leftAt).toISOString() : null;
    if (newLeft !== existingLeft) payload.leftAt = newLeft;
    if (values.status && values.status !== placement.status) payload.status = values.status;
    updateMutation.mutate(payload);
  }

  const err = (k: keyof EditFormValues) => form.formState.errors[k]?.message;
  const isPending = updateMutation.isPending;

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
          <DialogTitle className="text-base">{t.placementEdit}</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="max-h-[65vh] overflow-y-auto px-6 py-5">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>{t.placementPharmacy}</Label>
                <p className="rounded-xl border border-border bg-muted/40 px-3 py-2 text-sm uppercase text-muted-foreground">
                  {placement.pharmacy.name} ({placement.pharmacy.code})
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="e-role">
                  {t.placementRole}<span className="ml-0.5 text-destructive">*</span>
                </Label>
                <Controller
                  name="roleUuid"
                  control={form.control}
                  render={({ field }) => (
                    <Combobox
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                      options={roles.map((r) => ({ value: r.uuid, label: r.name }))}
                      placeholder={t.placementSelectRole}
                      className={cn(err("roleUuid") && "border-destructive")}
                    />
                  )}
                />
                <FieldError message={err("roleUuid")} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="e-joined-at">
                  {t.placementJoinedAt}<span className="ml-0.5 text-destructive">*</span>
                </Label>
                <Controller
                  name="joinedAt"
                  control={form.control}
                  render={({ field }) => (
                    <DateInput
                      id="e-joined-at"
                      {...field}
                      className={cn(err("joinedAt") && "border-destructive focus-visible:ring-destructive/30")}
                    />
                  )}
                />
                <FieldError message={err("joinedAt")} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="e-left-at">{t.placementLeftAt}</Label>
                <Controller
                  name="leftAt"
                  control={form.control}
                  render={({ field }) => (
                    <DateInput
                      id="e-left-at"
                      {...field}
                      className={cn(err("leftAt") && "border-destructive focus-visible:ring-destructive/30")}
                    />
                  )}
                />
                <FieldError message={err("leftAt")} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="e-status">{t.placementStatus}</Label>
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
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-border px-6 py-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending} className="rounded-xl">
              {t.cancel}
            </Button>
            <Button type="submit" disabled={isPending} className="min-w-[6rem] rounded-xl">
              {isPending
                ? <><Loader2 className="h-4 w-4 animate-spin" /> {t.placementSaving}</>
                : t.placementSave}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ── UserPlacementFormModal (exported) ──────────────────────────────────────────

export interface UserPlacementFormModalProps {
  mode: "create" | "edit";
  userUuid: string;
  placement?: PlacementItem;
  onClose: () => void;
  onSuccess: () => void;
}

export function UserPlacementFormModal({
  mode,
  userUuid,
  placement,
  onClose,
  onSuccess,
}: UserPlacementFormModalProps): JSX.Element {
  if (mode === "edit") {
    return (
      <PlacementEditForm
        userUuid={userUuid}
        placement={placement!}
        onClose={onClose}
        onSuccess={onSuccess}
      />
    );
  }
  return <PlacementCreateWizard userUuid={userUuid} onClose={onClose} onSuccess={onSuccess} />;
}

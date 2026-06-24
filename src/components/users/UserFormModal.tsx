import type { JSX } from "react";
import { useMemo, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { UserCog, Check, Loader2, AlertCircle } from "lucide-react";
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
  UserListItem,
  CreateUserPayload,
  UpdateUserPayload,
} from "@/types/user";
import { createUser, updateUser } from "@/service/userService";
import { getPharmaciesDdl } from "@/service/pharmacyService";
import { getRolesDdl } from "@/service/roleService";

// ── Helpers ────────────────────────────────────────────────────────────────────

function toISOString(dateStr: string): string {
  return new Date(dateStr).toISOString();
}

// ── StepIndicator ──────────────────────────────────────────────────────────────

const STEP_COUNT = 3;

interface StepIndicatorProps {
  current: 1 | 2 | 3;
  labels: [string, string, string];
}

function StepIndicator({ current, labels }: StepIndicatorProps): JSX.Element {
  return (
    <div className="px-6 pb-5 pt-3">
      {/* Circles + connector row */}
      <div className="relative mb-2.5">
        {/* Connector lines absolutely positioned between circle centers */}
        <div className="pointer-events-none absolute inset-x-[16.67%] top-3.5 flex">
          <div className={cn("h-px flex-1 transition-colors duration-300", current >= 2 ? "bg-primary" : "bg-border")} />
          <div className={cn("h-px flex-1 transition-colors duration-300", current >= 3 ? "bg-primary" : "bg-border")} />
        </div>

        {/* Circles — each centered in their equal third */}
        <div className="flex">
          {Array.from({ length: STEP_COUNT }, (_, i) => {
            const n = (i + 1) as 1 | 2 | 3;
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

      {/* Labels row — each centered in their equal third, matching circle positions */}
      <div className="flex">
        {labels.map((label, i) => {
          const n = (i + 1) as 1 | 2 | 3;
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

// ── Step 1: Basic Info ─────────────────────────────────────────────────────────

interface Step1Values {
  name: string;
  email: string;
  phone: string;
  address: string;
}

function makeStep1Schema(t: Translations) {
  return z.object({
    name: z.string().trim().min(1, t.userNameRequired).max(100),
    email: z.string().trim().min(1, t.userEmailRequired).email(t.userEmailInvalid),
    phone: z.string().trim().max(20).optional().or(z.literal("")),
    address: z.string().trim().max(255).optional().or(z.literal("")),
  });
}

interface Step1FormProps {
  t: Translations;
  defaultValues: Step1Values;
  onCancel: () => void;
  onNext: (values: Step1Values) => void;
}

function Step1Form({ t, defaultValues, onCancel, onNext }: Step1FormProps): JSX.Element {
  const schema = useMemo(() => makeStep1Schema(t), [t]);
  const form = useForm<Step1Values>({ resolver: zodResolver(schema), defaultValues });
  const err = (k: keyof Step1Values) => form.formState.errors[k]?.message;

  return (
    <form onSubmit={form.handleSubmit(onNext)} className="flex flex-col">
      <div className="px-6 pb-1 pt-0">
        <p className="text-xs text-muted-foreground">{t.userWizardStep1Hint}</p>
      </div>

      <div className="max-h-[45vh] overflow-y-auto px-6 py-4">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="w-name">
              {t.userName}<span className="ml-0.5 text-destructive">*</span>
            </Label>
            <Controller
              name="name"
              control={form.control}
              render={({ field }) => (
                <Input
                  id="w-name"
                  placeholder={t.userNamePlaceholder}
                  {...field}
                  className={cn(err("name") && "border-destructive focus-visible:ring-destructive/30")}
                />
              )}
            />
            <FieldError message={err("name")} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="w-email">
              {t.userEmail}<span className="ml-0.5 text-destructive">*</span>
            </Label>
            <Controller
              name="email"
              control={form.control}
              render={({ field }) => (
                <Input
                  id="w-email"
                  type="email"
                  placeholder={t.userEmailPlaceholder}
                  {...field}
                  className={cn(err("email") && "border-destructive focus-visible:ring-destructive/30")}
                />
              )}
            />
            <FieldError message={err("email")} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="w-phone">{t.userPhone}</Label>
            <Controller
              name="phone"
              control={form.control}
              render={({ field }) => (
                <Input id="w-phone" placeholder={t.userPhonePlaceholder} {...field} />
              )}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="w-address">{t.userAddress}</Label>
            <Controller
              name="address"
              control={form.control}
              render={({ field }) => (
                <Input id="w-address" placeholder={t.userAddressPlaceholder} {...field} />
              )}
            />
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

// ── Step 2: Pharmacy Placement ────────────────────────────────────────────────

interface Step2Values {
  pharmacyUuid: string;
  roleUuid: string;
  joinedAt: string;
}

function makeStep2Schema(t: Translations) {
  return z.object({
    pharmacyUuid: z.string().min(1, t.placementPharmacyRequired),
    roleUuid: z.string().min(1, t.placementRoleRequired),
    joinedAt: z.string().min(1, t.placementJoinedAtRequired),
  });
}

interface Step2FormProps {
  t: Translations;
  defaultValues: Step2Values;
  onBack: () => void;
  onNext: (values: Step2Values, requiresLicense: boolean) => void;
}

function Step2Form({ t, defaultValues, onBack, onNext }: Step2FormProps): JSX.Element {
  const schema = useMemo(() => makeStep2Schema(t), [t]);
  const form = useForm<Step2Values>({ resolver: zodResolver(schema), defaultValues });
  const err = (k: keyof Step2Values) => form.formState.errors[k]?.message;

  const { data: pharmaciesData } = useQuery({
    queryKey: ["pharmacies-ddl"],
    queryFn: () => getPharmaciesDdl(),
  });
  const { data: rolesData } = useQuery({
    queryKey: ["roles-ddl"],
    queryFn: () => getRolesDdl(),
  });

  const pharmacies = pharmaciesData?.data ?? [];
  const roles = rolesData?.data ?? [];

  function handleSubmit(values: Step2Values): void {
    const selectedRole = roles.find((r) => r.uuid === values.roleUuid);
    onNext(values, selectedRole?.requiresLicense ?? true);
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col">
      <div className="px-6 pb-1 pt-0">
        <p className="text-xs text-muted-foreground">{t.userWizardStep2Hint}</p>
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
        <Button type="button" variant="outline" onClick={onBack} className="rounded-xl">
          {t.wizardBack}
        </Button>
        <Button type="submit" className="min-w-[7rem] rounded-xl">
          {t.wizardNext}
        </Button>
      </div>
    </form>
  );
}

// ── Step 3: Practice License ───────────────────────────────────────────────────

interface Step3Values {
  licenseNumber: string;
  validFrom: string;
  validUntil: string;
}

function makeStep3Schema(t: Translations, required: boolean) {
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

interface Step3FormProps {
  t: Translations;
  isSubmitting: boolean;
  requiresLicense: boolean;
  onBack: () => void;
  onSubmit: (values: Step3Values) => void;
  onSkip: () => void;
}

function Step3Form({ t, isSubmitting, requiresLicense, onBack, onSubmit, onSkip }: Step3FormProps): JSX.Element {
  const schema = useMemo(() => makeStep3Schema(t, requiresLicense), [t, requiresLicense]);
  const form = useForm<Step3Values>({
    resolver: zodResolver(schema),
    defaultValues: { licenseNumber: "", validFrom: "", validUntil: "" },
  });
  const err = (k: keyof Step3Values) => form.formState.errors[k]?.message;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
      <div className="px-6 pb-1 pt-0">
        <p className="text-xs text-muted-foreground">{t.userWizardStep3Hint}</p>
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
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isSubmitting}
          className="rounded-xl"
        >
          {t.wizardBack}
        </Button>
        {!requiresLicense && (
          <Button
            type="button"
            variant="outline"
            onClick={onSkip}
            disabled={isSubmitting}
            className="rounded-xl"
          >
            {t.wizardSkip}
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting} className="min-w-[7.5rem] rounded-xl">
          {isSubmitting
            ? <><Loader2 className="h-4 w-4 animate-spin" /> {t.userCreating}</>
            : t.userCreate}
        </Button>
      </div>
    </form>
  );
}

// ── UserCreateWizard ───────────────────────────────────────────────────────────

interface UserCreateWizardProps {
  onClose: () => void;
  onSuccess: () => void;
}

function UserCreateWizard({ onClose, onSuccess }: UserCreateWizardProps): JSX.Element {
  const queryClient = useQueryClient();
  const { t, language } = useLanguage();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [step1Data, setStep1Data] = useState<Step1Values>({ name: "", email: "", phone: "", address: "" });
  const [step2Data, setStep2Data] = useState<Step2Values>({ pharmacyUuid: "", roleUuid: "", joinedAt: "" });
  const [licenseRequired, setLicenseRequired] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  function handleDialogClose(open: boolean): void {
    if (!open && !isSubmitting) onClose();
  }

  function handleStep1(values: Step1Values): void {
    setStep1Data(values);
    setStep(2);
  }

  function handleStep2(values: Step2Values, requiresLicense: boolean): void {
    setStep2Data(values);
    setLicenseRequired(requiresLicense);
    setStep(3);
  }

  async function submitAll(licenseValues: Step3Values | null): Promise<void> {
    setIsSubmitting(true);
    try {
      const license =
        licenseValues?.licenseNumber.trim()
          ? {
              licenseNumber: licenseValues.licenseNumber.trim(),
              validFrom: toISOString(licenseValues.validFrom),
              validUntil: toISOString(licenseValues.validUntil),
            }
          : undefined;

      const payload: CreateUserPayload = {
        name: step1Data.name,
        email: step1Data.email,
        phone: step1Data.phone?.trim() || undefined,
        address: step1Data.address?.trim() || undefined,
        placement: {
          pharmacyUuid: step2Data.pharmacyUuid,
          roleUuid: step2Data.roleUuid,
          joinedAt: toISOString(step2Data.joinedAt),
          license,
        },
      };
      await createUser(payload);

      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["users-dropdown"] });
      toast.success(t.userCreateSuccess);
      onSuccessRef.current();
    } catch (err) {
      toast.error(getApiErrorMessage(err, language, t.unexpectedError));
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleStep3(values: Step3Values): void {
    submitAll(values.licenseNumber.trim() ? values : null);
  }

  function handleSkipLicense(): void {
    submitAll(null);
  }

  const stepLabels: [string, string, string] = [
    t.userWizardStep1,
    t.userWizardStep2,
    t.userWizardStep3,
  ];

  return (
    <Dialog open onOpenChange={handleDialogClose}>
      <DialogContent
        className="max-w-md p-0"
        onInteractOutside={(e) => { if (isSubmitting) e.preventDefault(); }}
      >
        <DialogHeader className="flex flex-row items-center gap-3 space-y-0 border-b border-border px-6 py-4">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <UserCog className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <DialogTitle className="text-base">{t.userAdd}</DialogTitle>
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
            onCancel={onClose}
            onNext={handleStep1}
          />
        )}
        {step === 2 && (
          <Step2Form
            t={t}
            defaultValues={step2Data}
            onBack={() => setStep(1)}
            onNext={handleStep2}
          />
        )}
        {step === 3 && (
          <Step3Form
            t={t}
            isSubmitting={isSubmitting}
            requiresLicense={licenseRequired}
            onBack={() => setStep(2)}
            onSubmit={handleStep3}
            onSkip={handleSkipLicense}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

// ── UserEditDialog ─────────────────────────────────────────────────────────────

function makeEditSchema(t: Translations) {
  return z.object({
    name: z.string().trim().min(1, t.userNameRequired).max(100),
    email: z.string().trim().min(1, t.userEmailRequired).email(t.userEmailInvalid),
    phone: z.string().trim().max(20).optional().or(z.literal("")),
    address: z.string().trim().max(255).optional().or(z.literal("")),
    status: z.enum(["ACTIVE", "INACTIVE"] as const).optional(),
  });
}

interface EditFormValues {
  name: string;
  email: string;
  phone: string;
  address: string;
  status?: "ACTIVE" | "INACTIVE";
}

interface UserEditDialogProps {
  user: UserListItem;
  onClose: () => void;
  onSuccess: () => void;
}

function UserEditDialog({ user, onClose, onSuccess }: UserEditDialogProps): JSX.Element {
  const queryClient = useQueryClient();
  const { t, language } = useLanguage();
  const schema = useMemo(() => makeEditSchema(t), [t]);
  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  const form = useForm<EditFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user.name,
      email: user.email,
      phone: user.phone ?? "",
      address: user.address ?? "",
      status: (user.status === "ACTIVE" || user.status === "INACTIVE")
        ? user.status
        : undefined,
    },
  });

  const mutation = useMutation({
    mutationFn: (payload: UpdateUserPayload) => updateUser(user.uuid, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", user.uuid] });
      queryClient.invalidateQueries({ queryKey: ["users-dropdown"] });
      onSuccessRef.current();
    },
    onError: (err) => toast.error(getApiErrorMessage(err, language, t.unexpectedError)),
  });

  function onSubmit(values: EditFormValues): void {
    const payload: UpdateUserPayload = {};
    if (values.name !== user.name) payload.name = values.name;
    if (values.email !== user.email) payload.email = values.email;
    const phone = values.phone?.trim() || undefined;
    if (phone !== (user.phone ?? undefined)) payload.phone = phone;
    const address = values.address?.trim() || undefined;
    if (address !== (user.address ?? undefined)) payload.address = address;
    if (values.status && values.status !== user.status) payload.status = values.status;
    mutation.mutate(payload);
  }

  const err = (k: keyof EditFormValues) => form.formState.errors[k]?.message;

  return (
    <Dialog
      open
      onOpenChange={(open) => { if (!open && !mutation.isPending) onClose(); }}
    >
      <DialogContent
        className="max-w-md p-0"
        onInteractOutside={(e) => { if (mutation.isPending) e.preventDefault(); }}
      >
        <DialogHeader className="flex flex-row items-center gap-3 space-y-0 border-b border-border px-6 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
            <UserCog className="h-4 w-4 text-primary" />
          </div>
          <DialogTitle className="text-base">{t.userEdit}</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="max-h-[65vh] overflow-y-auto px-6 py-5">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="e-name">
                  {t.userName}<span className="ml-0.5 text-destructive">*</span>
                </Label>
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <Input
                      id="e-name"
                      placeholder={t.userNamePlaceholder}
                      {...field}
                      className={cn(err("name") && "border-destructive focus-visible:ring-destructive/30")}
                    />
                  )}
                />
                <FieldError message={err("name")} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="e-email">
                  {t.userEmail}<span className="ml-0.5 text-destructive">*</span>
                </Label>
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field }) => (
                    <Input
                      id="e-email"
                      type="email"
                      placeholder={t.userEmailPlaceholder}
                      {...field}
                      className={cn(err("email") && "border-destructive focus-visible:ring-destructive/30")}
                    />
                  )}
                />
                <FieldError message={err("email")} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="e-phone">{t.userPhone}</Label>
                <Controller
                  name="phone"
                  control={form.control}
                  render={({ field }) => (
                    <Input id="e-phone" placeholder={t.userPhonePlaceholder} {...field} />
                  )}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="e-address">{t.userAddress}</Label>
                <Controller
                  name="address"
                  control={form.control}
                  render={({ field }) => (
                    <Input id="e-address" placeholder={t.userAddressPlaceholder} {...field} />
                  )}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="e-status">{t.userStatus}</Label>
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
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={mutation.isPending}
              className="rounded-xl"
            >
              {t.cancel}
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="min-w-[6rem] rounded-xl"
            >
              {mutation.isPending
                ? <><Loader2 className="h-4 w-4 animate-spin" /> {t.userSaving}</>
                : t.userSave}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ── UserFormModal (exported) ────────────────────────────────────────────────────

export interface UserFormModalProps {
  mode: "create" | "edit";
  user?: UserListItem;
  onClose: () => void;
  onSuccess: () => void;
}

export function UserFormModal({
  mode,
  user,
  onClose,
  onSuccess,
}: UserFormModalProps): JSX.Element {
  if (mode === "edit") {
    return <UserEditDialog user={user!} onClose={onClose} onSuccess={onSuccess} />;
  }
  return <UserCreateWizard onClose={onClose} onSuccess={onSuccess} />;
}

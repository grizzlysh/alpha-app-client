import type { JSX } from "react";
import { useMemo, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Hospital, Check, Loader2, AlertCircle, UserPlus, Users, Clock, LayoutTemplate, Copy, Search, PartyPopper } from "lucide-react";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import type { PharmacyCategory, CreatePharmacyPayload, PharmacyCreateResult, PharmacyOwnerInput } from "@/types/pharmacy";
import { createPharmacy, getPharmaciesDdl } from "@/service/pharmacyService";
import { getUsers } from "@/service/userService";
import { useDebounce } from "use-debounce";
import { TempPasswordBox } from "@/components/shared/TempPasswordBox";

// ── StepIndicator ─────────────────────────────────────────────────────────────

const STEP_COUNT = 4;
type Step = 1 | 2 | 3 | 4;

interface StepIndicatorProps {
  current: Step;
  labels: string[];
}

function StepIndicator({ current, labels }: StepIndicatorProps): JSX.Element {
  return (
    <div className="px-6 pb-5 pt-3">
      <div className="relative mb-2.5">
        <div className="pointer-events-none absolute inset-x-[12.5%] top-3.5 flex">
          {Array.from({ length: STEP_COUNT - 1 }, (_, i) => (
            <div key={i} className={cn("h-px flex-1 transition-colors duration-300", current >= i + 2 ? "bg-primary" : "bg-border")} />
          ))}
        </div>
        <div className="flex">
          {Array.from({ length: STEP_COUNT }, (_, i) => {
            const n = (i + 1) as Step;
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
          const n = (i + 1) as Step;
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
  code: string;
  category: PharmacyCategory;
  phone: string;
  address: string;
  location: string;
  email: string;
}

function makeStep1Schema(t: Translations) {
  return z.object({
    name: z.string().trim().min(1, t.pharmaNameRequired).max(200),
    code: z
      .string()
      .trim()
      .min(1, t.pharmaCodeRequired)
      .max(5, t.pharmaCodeInvalid)
      .regex(/^[a-zA-Z0-9]*$/, t.pharmaCodeInvalid),
    category: z.enum(["APOTEK", "KLINIK", "RUMAH_SAKIT", "PUSKESMAS"] as const, {
      required_error: t.pharmaCategoryRequired,
    }),
    phone: z.string().trim().min(1, t.pharmaPhoneRequired).max(20),
    address: z.string().trim().min(1, t.pharmaAddressRequired).max(500),
    location: z.string().trim().min(1, t.pharmaLocationRequired).max(200),
    email: z.string().trim().email(t.pharmaEmailInvalid).max(200).optional().or(z.literal("")),
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
        <p className="text-xs text-muted-foreground">{t.pharmaWizardStep1Hint}</p>
      </div>

      <div className="max-h-[45vh] overflow-y-auto px-6 py-4">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="w-name">
              {t.pharmaName}<span className="ml-0.5 text-destructive">*</span>
            </Label>
            <Controller name="name" control={form.control} render={({ field }) => (
              <Input id="w-name" placeholder={t.pharmaNamePlaceholder} {...field}
                className={cn(err("name") && "border-destructive focus-visible:ring-destructive/30")} />
            )} />
            <FieldError message={err("name")} />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="w-code">
                {t.pharmaCode}<span className="ml-0.5 text-destructive">*</span>
              </Label>
              <span className="text-xs text-muted-foreground">
                {(form.watch("code") ?? "").length}/5
              </span>
            </div>
            <Controller name="code" control={form.control} render={({ field }) => (
              <Input
                id="w-code"
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
                  err("code") && "border-destructive focus-visible:ring-destructive/30"
                )}
              />
            )} />
            {err("code") ? <FieldError message={err("code")} /> : <p className="text-xs text-muted-foreground">{t.onbCodeHint}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>
              {t.pharmaCategory}<span className="ml-0.5 text-destructive">*</span>
            </Label>
            <Controller name="category" control={form.control} render={({ field }) => (
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
                className={cn(err("category") && "border-destructive")}
              />
            )} />
            <FieldError message={err("category")} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="w-phone">
              {t.pharmaPhone}<span className="ml-0.5 text-destructive">*</span>
            </Label>
            <Controller name="phone" control={form.control} render={({ field }) => (
              <Input id="w-phone" placeholder={t.pharmaPhonePlaceholder} {...field}
                className={cn(err("phone") && "border-destructive focus-visible:ring-destructive/30")} />
            )} />
            <FieldError message={err("phone")} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="w-address">
              {t.pharmaAddress}<span className="ml-0.5 text-destructive">*</span>
            </Label>
            <Controller name="address" control={form.control} render={({ field }) => (
              <Input id="w-address" placeholder={t.pharmaAddressPlaceholder} {...field}
                className={cn(err("address") && "border-destructive focus-visible:ring-destructive/30")} />
            )} />
            <FieldError message={err("address")} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="w-location">
              {t.pharmaLocation}<span className="ml-0.5 text-destructive">*</span>
            </Label>
            <Controller name="location" control={form.control} render={({ field }) => (
              <Input id="w-location" placeholder={t.pharmaLocationPlaceholder} {...field}
                className={cn(err("location") && "border-destructive focus-visible:ring-destructive/30")} />
            )} />
            <FieldError message={err("location")} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="w-email">{t.pharmaEmail}</Label>
            <Controller name="email" control={form.control} render={({ field }) => (
              <Input id="w-email" type="email" placeholder={t.pharmaEmailPlaceholder} {...field}
                className={cn(err("email") && "border-destructive focus-visible:ring-destructive/30")} />
            )} />
            <FieldError message={err("email")} />
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

// ── Step 2: Business License (optional) ───────────────────────────────────────

interface Step2Values {
  licenseNumber: string;
  validFrom: string;
  validUntil: string;
}

function makeStep2Schema(t: Translations) {
  return z
    .object({
      licenseNumber: z.string().trim().min(1, t.bizLicenseNumberRequired).max(100),
      validFrom: z.string().min(1, t.bizLicenseValidFromRequired),
      validUntil: z.string().min(1, t.bizLicenseValidUntilRequired),
    })
    .refine((d) => !d.validFrom || !d.validUntil || d.validUntil > d.validFrom, {
      message: t.bizLicenseValidUntilAfterFrom,
      path: ["validUntil"],
    });
}

interface Step2FormProps {
  t: Translations;
  defaultValues: Step2Values;
  onBack: () => void;
  onNext: (values: Step2Values | null) => void;
}

function Step2Form({ t, defaultValues, onBack, onNext }: Step2FormProps): JSX.Element {
  const schema = useMemo(() => makeStep2Schema(t), [t]);
  const form = useForm<Step2Values>({ resolver: zodResolver(schema), defaultValues });
  const err = (k: keyof Step2Values) => form.formState.errors[k]?.message;

  return (
    <form onSubmit={form.handleSubmit(onNext)} className="flex flex-col">
      <div className="px-6 pb-1 pt-0">
        <p className="text-xs text-muted-foreground">{t.onbLicenseHint}</p>
      </div>

      <div className="max-h-[45vh] overflow-y-auto px-6 py-4">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="w-license-num">
              {t.bizLicenseNumber}<span className="ml-0.5 text-destructive">*</span>
            </Label>
            <Controller name="licenseNumber" control={form.control} render={({ field }) => (
              <Input id="w-license-num" placeholder={t.bizLicenseNumberPlaceholder} {...field}
                className={cn(err("licenseNumber") && "border-destructive focus-visible:ring-destructive/30")} />
            )} />
            <FieldError message={err("licenseNumber")} />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>
                {t.bizLicenseValidFrom}<span className="ml-0.5 text-destructive">*</span>
              </Label>
              <Controller name="validFrom" control={form.control} render={({ field }) => (
                <DateInput value={field.value} onChange={field.onChange} onBlur={field.onBlur}
                  placeholder={t.bizLicenseValidFrom} className={cn(err("validFrom") && "border-destructive")} />
              )} />
              <FieldError message={err("validFrom")} />
            </div>
            <div className="space-y-1.5">
              <Label>
                {t.bizLicenseValidUntil}<span className="ml-0.5 text-destructive">*</span>
              </Label>
              <Controller name="validUntil" control={form.control} render={({ field }) => (
                <DateInput value={field.value} onChange={field.onChange} onBlur={field.onBlur}
                  placeholder={t.bizLicenseValidUntil} className={cn(err("validUntil") && "border-destructive")} />
              )} />
              <FieldError message={err("validUntil")} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-end gap-2 border-t border-border px-6 py-4">
        <Button type="button" variant="outline" onClick={onBack} className="rounded-xl">
          {t.wizardBack}
        </Button>
        <Button type="button" variant="ghost" onClick={() => onNext(null)} className="rounded-xl">
          {t.onbLicenseLater}
        </Button>
        <Button type="submit" className="min-w-[7rem] rounded-xl">
          {t.wizardNext}
        </Button>
      </div>
    </form>
  );
}

// ── Step 3: Owner & starting data ─────────────────────────────────────────────

type OwnerMode = "new" | "existing" | "later";
type StartMode = "template" | "copy";

interface Step3State {
  ownerMode: OwnerMode;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  existingUser: { uuid: string; name: string; email: string } | null;
  startMode: StartMode;
  copyFrom: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function ChoiceCard({
  active,
  icon: Icon,
  title,
  desc,
  onClick,
}: {
  active: boolean;
  icon: typeof Users;
  title: string;
  desc: string;
  onClick: () => void;
}): JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex flex-1 items-start gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-colors",
        active ? "border-primary bg-primary/5 ring-1 ring-primary/30" : "border-border hover:bg-muted/40"
      )}
    >
      <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", active ? "text-primary" : "text-muted-foreground")} aria-hidden />
      <span className="min-w-0">
        <span className="block text-sm font-medium text-foreground">{title}</span>
        <span className="block text-xs leading-snug text-muted-foreground">{desc}</span>
      </span>
    </button>
  );
}

function ExistingUserPicker({
  t,
  value,
  onChange,
}: {
  t: Translations;
  value: Step3State["existingUser"];
  onChange: (u: Step3State["existingUser"]) => void;
}): JSX.Element {
  const [search, setSearch] = useState("");
  const [debounced] = useDebounce(search.trim(), 300);
  const { data, isFetching } = useQuery({
    queryKey: ["users", "owner-picker", debounced],
    queryFn: () => getUsers({ search: debounced, limit: 8, status: "ACTIVE" }),
    enabled: debounced.length >= 2,
    staleTime: 30_000,
  });
  const users = (data?.data ?? []).filter((u) => u.platformRole === null);

  if (value) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-xl border border-primary/40 bg-primary/5 px-3 py-2.5">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium uppercase text-foreground">{value.name}</p>
          <p className="truncate text-xs text-muted-foreground">{value.email}</p>
        </div>
        <Button type="button" variant="ghost" size="sm" className="h-8 rounded-lg text-xs" onClick={() => onChange(null)}>
          {t.onbChange}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          autoFocus
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t.onbSearchUser}
          className="h-10 rounded-xl pl-9"
        />
        {isFetching && <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />}
      </div>
      {debounced.length >= 2 && !isFetching && users.length === 0 && (
        <p className="px-1 text-xs text-muted-foreground">{t.onbNoUserFound}</p>
      )}
      {users.length > 0 && (
        <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border">
          {users.map((u) => (
            <li key={u.uuid}>
              <button
                type="button"
                onClick={() => onChange({ uuid: u.uuid, name: u.name, email: u.email })}
                className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left hover:bg-muted/40"
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium uppercase text-foreground">{u.name}</span>
                  <span className="block truncate text-xs text-muted-foreground">{u.email}</span>
                </span>
                <span className="shrink-0 text-[11px] text-muted-foreground">
                  {t.onbPharmacyCount.replace("{n}", String(u.placementCount))}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

interface Step3FormProps {
  t: Translations;
  isSubmitting: boolean;
  onBack: () => void;
  onSubmit: (state: Step3State) => void;
}

function Step3Form({ t, isSubmitting, onBack, onSubmit }: Step3FormProps): JSX.Element {
  const [state, setState] = useState<Step3State>({
    ownerMode: "new",
    ownerName: "",
    ownerEmail: "",
    ownerPhone: "",
    existingUser: null,
    startMode: "template",
    copyFrom: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const set = (patch: Partial<Step3State>) => setState((s) => ({ ...s, ...patch }));

  const { data: pharmaciesData } = useQuery({
    queryKey: ["pharmacies-ddl"],
    queryFn: getPharmaciesDdl,
    staleTime: 60_000,
  });
  const pharmacies = pharmaciesData?.data ?? [];

  const errors = {
    ownerName: state.ownerMode === "new" && !state.ownerName.trim() ? t.onbOwnerNameRequired : undefined,
    ownerEmail:
      state.ownerMode === "new" && !EMAIL_RE.test(state.ownerEmail.trim()) ? t.pharmaEmailInvalid : undefined,
    existingUser: state.ownerMode === "existing" && !state.existingUser ? t.onbPickUser : undefined,
    copyFrom: state.startMode === "copy" && !state.copyFrom ? t.onbPickPharmacy : undefined,
  };
  const show = (k: keyof typeof errors) => (submitted ? errors[k] : undefined);

  function submit(e: React.FormEvent): void {
    e.preventDefault();
    setSubmitted(true);
    if (Object.values(errors).some(Boolean)) return;
    onSubmit(state);
  }

  return (
    <form onSubmit={submit} className="flex flex-col">
      <div className="max-h-[52vh] space-y-6 overflow-y-auto px-6 pb-4 pt-1">
        {/* ── Owner ── */}
        <section className="space-y-3">
          <div>
            <h3 className="text-sm font-semibold text-foreground">{t.onbOwnerTitle}</h3>
            <p className="text-xs text-muted-foreground">{t.onbOwnerDesc}</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <ChoiceCard active={state.ownerMode === "new"} icon={UserPlus} title={t.onbOwnerNew} desc={t.onbOwnerNewDesc} onClick={() => set({ ownerMode: "new" })} />
            <ChoiceCard active={state.ownerMode === "existing"} icon={Users} title={t.onbOwnerExisting} desc={t.onbOwnerExistingDesc} onClick={() => set({ ownerMode: "existing" })} />
            <ChoiceCard active={state.ownerMode === "later"} icon={Clock} title={t.onbOwnerLater} desc={t.onbOwnerLaterDesc} onClick={() => set({ ownerMode: "later" })} />
          </div>

          {state.ownerMode === "new" && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="w-owner-name">
                  {t.onbOwnerName}<span className="ml-0.5 text-destructive">*</span>
                </Label>
                <Input id="w-owner-name" value={state.ownerName} onChange={(e) => set({ ownerName: e.target.value })}
                  className={cn(show("ownerName") && "border-destructive")} />
                <FieldError message={show("ownerName")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="w-owner-email">
                  {t.onbOwnerEmail}<span className="ml-0.5 text-destructive">*</span>
                </Label>
                <Input id="w-owner-email" type="email" value={state.ownerEmail} onChange={(e) => set({ ownerEmail: e.target.value })}
                  className={cn(show("ownerEmail") && "border-destructive")} />
                <FieldError message={show("ownerEmail")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="w-owner-phone">{t.onbOwnerPhone}</Label>
                <Input id="w-owner-phone" value={state.ownerPhone} onChange={(e) => set({ ownerPhone: e.target.value })} />
              </div>
            </div>
          )}
          {state.ownerMode === "existing" && (
            <div className="space-y-1.5">
              <ExistingUserPicker t={t} value={state.existingUser} onChange={(u) => set({ existingUser: u })} />
              <FieldError message={show("existingUser")} />
            </div>
          )}
          {state.ownerMode === "later" && (
            <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
              {t.onbOwnerLaterWarn}
            </p>
          )}
        </section>

        {/* ── Starting data ── */}
        <section className="space-y-3">
          <div>
            <h3 className="text-sm font-semibold text-foreground">{t.onbStartTitle}</h3>
            <p className="text-xs text-muted-foreground">{t.onbStartDesc}</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <ChoiceCard active={state.startMode === "template"} icon={LayoutTemplate} title={t.onbStartTemplate} desc={t.onbStartTemplateDesc} onClick={() => set({ startMode: "template" })} />
            <ChoiceCard active={state.startMode === "copy"} icon={Copy} title={t.onbStartCopy} desc={t.onbStartCopyDesc} onClick={() => set({ startMode: "copy" })} />
          </div>
          {state.startMode === "copy" && (
            <div className="space-y-1.5">
              <Combobox
                value={state.copyFrom}
                onValueChange={(v) => set({ copyFrom: v })}
                options={pharmacies.map((p) => ({ value: p.uuid, label: `${p.name.toUpperCase()} (${p.code})` }))}
                placeholder={t.onbPickPharmacy}
                className={cn(show("copyFrom") && "border-destructive")}
              />
              <FieldError message={show("copyFrom")} />
            </div>
          )}
        </section>
      </div>

      <div className="flex justify-end gap-2 border-t border-border px-6 py-4">
        <Button type="button" variant="outline" onClick={onBack} disabled={isSubmitting} className="rounded-xl">
          {t.wizardBack}
        </Button>
        <Button type="submit" disabled={isSubmitting} className="min-w-[8rem] rounded-xl">
          {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" /> {t.pharmaSaving}</> : t.onbCreate}
        </Button>
      </div>
    </form>
  );
}

// ── Step 4: Done ──────────────────────────────────────────────────────────────

function DoneStep({ t, result, onClose }: { t: Translations; result: PharmacyCreateResult; onClose: () => void }): JSX.Element {
  const { pharmacy, owner, copied } = result;
  return (
    <div className="flex flex-col">
      <div className="max-h-[55vh] space-y-4 overflow-y-auto px-6 pb-4 pt-1">
        <div className="flex items-center gap-3 rounded-xl bg-success/10 px-4 py-3">
          <PartyPopper className="h-5 w-5 shrink-0 text-success" aria-hidden />
          <p className="text-sm text-foreground">
            {t.onbDoneTitle.replace("{name}", pharmacy.name.toUpperCase()).replace("{code}", pharmacy.code)}
          </p>
        </div>

        {owner && (
          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">{t.onbOwnerTitle}</h3>
            <p className="text-sm">
              <span className="font-medium uppercase">{owner.name}</span>
              <span className="text-muted-foreground"> · {owner.email}</span>
            </p>
            {owner.temporaryPassword ? (
              <>
                <p className="text-xs text-muted-foreground">{t.onbTempPasswordDesc}</p>
                <TempPasswordBox password={owner.temporaryPassword} />
              </>
            ) : (
              <p className="text-xs text-muted-foreground">{t.onbExistingOwnerDesc}</p>
            )}
          </section>
        )}

        {copied && (
          <p className="text-xs text-muted-foreground">
            {t.onbCopiedSummary
              .replace("{medicines}", String(copied.medicines))
              .replace("{classes}", String(copied.shapes + copied.types + copied.classes))}
          </p>
        )}

        <section className="space-y-1.5">
          <h3 className="text-sm font-semibold text-foreground">{t.onbNextTitle}</h3>
          <ol className="list-decimal space-y-1 pl-5 text-xs text-muted-foreground">
            <li>{t.onbNext1}</li>
            {!pharmacy.activeLicense && <li>{t.onbNext2}</li>}
            <li>{t.onbNext3}</li>
            <li>{t.onbNext4}</li>
          </ol>
        </section>
      </div>
      <div className="flex justify-end border-t border-border px-6 py-4">
        <Button onClick={onClose} className="min-w-[7rem] rounded-xl">
          {t.wizardDone}
        </Button>
      </div>
    </div>
  );
}

// ── PharmacyWizardModal ────────────────────────────────────────────────────────

export interface PharmacyWizardModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

/**
 * Onboarding a pharmacy: details → business license (optional) → owner and
 * starting data. Everything is sent in one request at the end, so a failure
 * never leaves a half-created pharmacy behind and retrying is safe.
 */
export function PharmacyWizardModal({ onClose, onSuccess }: PharmacyWizardModalProps): JSX.Element {
  const queryClient = useQueryClient();
  const { t, language } = useLanguage();
  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  const [step, setStep] = useState<Step>(1);
  const [step1Data, setStep1Data] = useState<Step1Values>({
    name: "", code: "", category: undefined as unknown as PharmacyCategory,
    phone: "", address: "", location: "", email: "",
  });
  const [license, setLicense] = useState<Step2Values | null>(null);
  const [result, setResult] = useState<PharmacyCreateResult | null>(null);

  const mutation = useMutation({
    mutationFn: (payload: CreatePharmacyPayload) => createPharmacy(payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["pharmacies"] });
      queryClient.invalidateQueries({ queryKey: ["pharmacies-ddl"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      if (res.data) {
        setResult(res.data);
        setStep(4);
      }
    },
    onError: (err) => toast.error(getApiErrorMessage(err, language, t.unexpectedError)),
  });

  const stepLabels = [t.pharmaWizardStep1, t.pharmaWizardStep2, t.onbStepOwner, t.wizardDone];

  function handleStep3(state: Step3State): void {
    let owner: PharmacyOwnerInput | undefined;
    if (state.ownerMode === "new") {
      owner = {
        mode: "new",
        name: state.ownerName.trim(),
        email: state.ownerEmail.trim(),
        phone: state.ownerPhone.trim() || undefined,
      };
    } else if (state.ownerMode === "existing" && state.existingUser) {
      owner = { mode: "existing", userUuid: state.existingUser.uuid };
    }

    mutation.mutate({
      name: step1Data.name.trim(),
      code: step1Data.code.trim().toUpperCase(),
      category: step1Data.category,
      phone: step1Data.phone.trim(),
      address: step1Data.address.trim(),
      location: step1Data.location.trim(),
      email: step1Data.email?.trim() || undefined,
      license: license
        ? { licenseNumber: license.licenseNumber.trim(), validFrom: license.validFrom, validUntil: license.validUntil }
        : undefined,
      owner,
      copyFromPharmacyUuid: state.startMode === "copy" ? state.copyFrom : undefined,
    });
  }

  const done = step === 4;
  const busy = mutation.isPending;

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (open || busy) return;
        if (done) onSuccessRef.current();
        else onClose();
      }}
    >
      <DialogContent
        className="max-w-lg p-0"
        // Don't let a stray click discard the only copy of the owner's temporary password.
        onInteractOutside={(e) => { if (busy || done) e.preventDefault(); }}
      >
        <DialogHeader className="flex flex-row items-center gap-3 space-y-0 border-b border-border px-6 py-4">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <Hospital className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <DialogTitle className="text-base">{t.pharmaAdd}</DialogTitle>
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
            onNext={(values) => {
              setStep1Data(values);
              setStep(2);
            }}
          />
        )}
        {step === 2 && (
          <Step2Form
            t={t}
            defaultValues={license ?? { licenseNumber: "", validFrom: "", validUntil: "" }}
            onBack={() => setStep(1)}
            onNext={(values) => {
              setLicense(values);
              setStep(3);
            }}
          />
        )}
        {step === 3 && (
          <Step3Form t={t} isSubmitting={busy} onBack={() => setStep(2)} onSubmit={handleStep3} />
        )}
        {step === 4 && result && <DoneStep t={t} result={result} onClose={() => onSuccessRef.current()} />}
      </DialogContent>
    </Dialog>
  );
}

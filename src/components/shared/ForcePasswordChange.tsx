import type { JSX } from "react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, Eye, EyeOff, KeyRound, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/utils/cn";
import type { Translations } from "@/configs/i18n";

function makeSchema(t: Translations) {
  return z
    .object({
      newPassword: z
        .string()
        .min(8, t.profileNewPasswordMinLength)
        .regex(/[A-Z]/, t.profileNewPasswordUppercase)
        .regex(/[0-9]/, t.profileNewPasswordNumber),
      confirmPassword: z.string(),
    })
    .refine((d) => d.newPassword === d.confirmPassword, { message: t.profilePasswordMismatch, path: ["confirmPassword"] });
}

type Values = z.infer<ReturnType<typeof makeSchema>>;

/**
 * Shown on the sign-in page when the account still has a temporary password
 * (new account or reset): the user sets their own before entering the app.
 */
export function ForcePasswordChange({
  email,
  isPending,
  onSubmit,
  onCancel,
}: {
  email: string;
  isPending: boolean;
  onSubmit: (newPassword: string) => void;
  onCancel: () => void;
}): JSX.Element {
  const { t } = useLanguage();
  const schema = useMemo(() => makeSchema(t), [t]);
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { newPassword: "", confirmPassword: "" } });
  const [show, setShow] = useState(false);
  const err = form.formState.errors;

  const field = (name: keyof Values, label: string, autoFocus = false) => (
    <div className="space-y-1.5">
      <Label htmlFor={`fpc-${name}`} className="text-sm font-medium text-foreground/90">
        {label}
      </Label>
      <div className="relative">
        <Input
          id={`fpc-${name}`}
          type={show ? "text" : "password"}
          autoComplete="new-password"
          autoFocus={autoFocus}
          disabled={isPending}
          {...form.register(name)}
          className={cn("h-11 rounded-xl pr-10", err[name] && "border-destructive/70")}
        />
        {name === "newPassword" && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShow((s) => !s)}
            aria-label={show ? t.hidePassword : t.showPassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-muted-foreground"
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {err[name] ? (
        <p className="text-xs text-destructive">{err[name]?.message}</p>
      ) : name === "newPassword" ? (
        <p className="text-xs text-muted-foreground">{t.profileNewPasswordHint}</p>
      ) : null}
    </div>
  );

  return (
    <div>
      <div className="mb-6 flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <KeyRound className="h-5 w-5 text-primary" />
        </span>
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">{t.forcePwTitle}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t.forcePwDesc.replace("{email}", email)}</p>
        </div>
      </div>

      <form onSubmit={form.handleSubmit((v) => onSubmit(v.newPassword))} className="space-y-5" noValidate>
        {field("newPassword", t.profileNewPasswordLabel, true)}
        {field("confirmPassword", t.profileConfirmPasswordLabel)}
        <Button type="submit" disabled={isPending} className="h-11 w-full rounded-xl font-medium">
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {t.forcePwSubmit}
          {!isPending && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isPending}
          className="w-full text-center text-sm text-muted-foreground hover:text-foreground"
        >
          {t.forcePwBack}
        </button>
      </form>
    </div>
  );
}

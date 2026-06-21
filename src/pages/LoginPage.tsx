import type { JSX } from "react";
import { useState, useMemo, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Loader2,
  Eye,
  EyeOff,
  Pill,
  Moon,
  Sun,
  Languages,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/utils/cn";

import { useLogin } from "@/hooks/useLogin";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";

interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

export default function LoginPage(): JSX.Element {
  const { theme, toggleTheme } = useTheme();
  const { language, t, toggleLanguage } = useLanguage();
  const { submit, isPending } = useLogin();

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    document.title = `${t.signIn} — ${t.appName}`;
  }, [t.signIn, t.appName]);

  useEffect(() => {
    const reason = sessionStorage.getItem("auth_redirect_reason");
    if (!reason) return;
    sessionStorage.removeItem("auth_redirect_reason");
    if (reason === "session_expired") {
      toast.warning(t.sessionExpiredTitle, { id: "auth-redirect", description: t.sessionExpiredDesc });
    } else if (reason === "logout_success") {
      toast.success(t.logoutSuccessTitle, { id: "auth-redirect", description: t.logoutSuccessDesc });
    }
  }, [t]);

  const loginSchema = useMemo(
    () =>
      z.object({
        email: z.string().min(1, t.emailRequired).email(t.emailInvalid),
        password: z
          .string()
          .min(1, t.passwordRequired)
          .min(8, t.passwordMinLength),
        rememberMe: z.boolean(),
      }),
    [t]
  );

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  const triggerRef = useRef(form.trigger);
  triggerRef.current = form.trigger;
  const errorsRef = useRef(form.formState.errors);
  errorsRef.current = form.formState.errors;

  useEffect(() => {
    if (Object.keys(errorsRef.current).length > 0) {
      void triggerRef.current();
    }
  }, [language]);

  function onSubmit(values: LoginFormValues): void {
    submit(values.email, values.password);
  }

  const features = [
    t.featureStock,
    t.featurePOS,
    t.featurePrescriptions,
  ] as const;

  return (
    <div className="flex min-h-screen">

      {/* ── Left branding panel ────────────────────────────────────── */}
      <div className="relative hidden overflow-hidden lg:flex lg:w-[60%] flex-col justify-between p-10 xl:p-12 bg-gradient-to-b from-brand-start via-brand-mid to-brand-end text-white">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/25 via-transparent to-white/5" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25 backdrop-blur-sm">
            <Pill className="h-5 w-5" />
          </div>
          <div>
            <p className="text-base font-bold leading-none tracking-tight">
              {t.appName}
            </p>
            <p className="mt-0.5 text-xs text-white/55">{t.appSubtitle}</p>
          </div>
        </div>

        {/* Headline + features */}
        <div className="relative z-10 space-y-9">
          <div>
            <h2 className="text-3xl font-bold leading-snug tracking-tight xl:text-4xl">
              {t.featureHeadline}
            </h2>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/65 xl:text-base">
              {t.featureDesc}
            </p>
          </div>

          <ul className="space-y-3.5">
            {features.map((feature) => (
              <li key={feature} className="flex items-center gap-3 text-sm">
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/20">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </div>
                <span className="text-white/85">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 text-xs text-white/35">{t.copyright}</p>
      </div>

      {/* ── Right form panel ──────────────────────────────────────── */}
      <div className="relative flex w-full flex-col overflow-hidden bg-background lg:w-[40%]">
        {/* Ambient glows */}
        <div className="pointer-events-none absolute inset-0 -z-0">
          <div className="absolute -right-32 -top-32 h-[360px] w-[360px] rounded-full bg-primary/6 blur-[100px]" />
          <div className="absolute -bottom-32 -left-20 h-[300px] w-[300px] rounded-full bg-brand-mid/7 blur-[90px]" />
        </div>

        {/* Top controls */}
        <header className="relative z-10 flex items-center justify-between px-6 py-5 lg:justify-end">
          {/* Mobile-only brand */}
          <div className="flex items-center gap-2 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-brand-start to-brand-end shadow-sm">
              <Pill className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-foreground">
              {t.appName}
            </span>
          </div>

          {/* Fixed-width language + theme controls */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              aria-label={
                language === "en" ? "Switch to Indonesian" : "Switch to English"
              }
              className="h-9 w-[72px] justify-center gap-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <Languages className="h-4 w-4 flex-shrink-0" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                {language}
              </span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label={theme === "light" ? t.switchToDark : t.switchToLight}
              className="h-9 w-9 flex-shrink-0 text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              {theme === "light" ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Button>
          </div>
        </header>

        {/* Centered form — no card, sits directly on background */}
        <main className="relative z-10 flex flex-1 items-center justify-center px-5 pb-12 pt-2">
          <div className="w-full max-w-[400px]">

            {/* Heading */}
            <div className="mb-8">
              <h1 className="text-[2rem] leading-tight tracking-tight text-foreground">
                {t.welcomeBack}{" "}
                <em className="font-display font-normal italic text-primary">
                  {t.appName}
                </em>
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {t.signInSubtitle}
              </p>
            </div>

            {/* Form */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
                noValidate
              >
                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field, fieldState }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-sm font-medium text-foreground/90">
                        {t.email}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder={t.emailPlaceholder}
                          autoComplete="email"
                          disabled={isPending}
                          className={cn(
                            "h-11 rounded-xl transition-all duration-150 focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-0",
                            fieldState.error
                              ? "border-destructive/70 focus-visible:ring-destructive/40"
                              : "border-border hover:border-border/80"
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* Password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field, fieldState }) => (
                    <FormItem className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-sm font-medium text-foreground/90">
                          {t.password}
                        </FormLabel>
                        <button
                          type="button"
                          tabIndex={-1}
                          className="text-xs font-medium text-primary transition-colors hover:text-primary/70 focus-visible:outline-none focus-visible:underline"
                        >
                          {t.forgotPassword}
                        </button>
                      </div>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder={t.passwordPlaceholder}
                            autoComplete="current-password"
                            disabled={isPending}
                            className={cn(
                              "h-11 rounded-xl pr-10 transition-all duration-150 focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-0",
                              fieldState.error
                                ? "border-destructive/70 focus-visible:ring-destructive/40"
                                : "border-border hover:border-border/80"
                            )}
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((p) => !p)}
                            tabIndex={-1}
                            aria-label={
                              showPassword ? t.hidePassword : t.showPassword
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 transition-colors hover:text-muted-foreground focus-visible:outline-none"
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* Remember me — plain div to avoid FormItem space-y conflict */}
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        id="rememberMe"
                        checked={field.value}
                        onChange={field.onChange}
                        disabled={isPending}
                        className="h-4 w-4 flex-shrink-0 cursor-pointer rounded border-border accent-primary disabled:cursor-not-allowed"
                      />
                      <label
                        htmlFor="rememberMe"
                        className="cursor-pointer select-none text-sm leading-none text-muted-foreground"
                      >
                        {t.rememberMe}
                      </label>
                    </div>
                  )}
                />

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={isPending}
                  className="h-11 w-full rounded-xl bg-primary font-medium text-white shadow-sm shadow-primary/20 transition-all duration-200 hover:bg-primary/85 hover:shadow-md hover:shadow-primary/25 active:scale-[0.99] disabled:opacity-60"
                >
                  {isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  {isPending ? t.signingIn : t.signIn}
                  {!isPending && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </form>
            </Form>

            {/* Bottom link */}
            <p className="mt-7 text-center text-sm text-muted-foreground">
              {t.noAccount}{" "}
              <button
                type="button"
                className="font-semibold text-primary transition-colors hover:text-primary/75 focus-visible:outline-none focus-visible:underline"
              >
                {t.contactAdmin}
              </button>
            </p>

            {/* Mobile copyright */}
            <p className="mt-8 text-center text-xs text-muted-foreground/50 lg:hidden">
              {t.copyright}
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

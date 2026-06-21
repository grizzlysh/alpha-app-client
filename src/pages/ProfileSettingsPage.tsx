import type { JSX } from "react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  UserRound,
  KeyRound,
  Building2,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  AlertTriangle,
} from "lucide-react";

import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguage";
import { useScrollAwareTitle } from "@/hooks/useScrollAwareTitle";
import { getApiErrorMessage } from "@/utils/apiError";
import { formatDate } from "@/utils/dateHelpers";
import type { AppDispatch } from "@/store";
import type { Translations } from "@/configs/i18n";
import type { UpdateMePayload, ChangePasswordPayload } from "@/types/user";
import { getMe, updateMe, changePassword } from "@/service/meService";
import { updateUserProfile } from "@/store/authSlice";

// ── Schemas ───────────────────────────────────────────────────────────────────

function makeProfileSchema(t: Translations) {
  return z.object({
    name: z.string().min(1, t.profileNameRequired),
    phone: z.string().optional(),
    address: z.string().optional(),
  });
}

function makePasswordSchema(t: Translations) {
  return z
    .object({
      currentPassword: z.string().min(1, t.profileCurrentPasswordRequired),
      newPassword: z
        .string()
        .min(8, t.profileNewPasswordMinLength)
        .regex(/[A-Z]/, t.profileNewPasswordUppercase)
        .regex(/[0-9]/, t.profileNewPasswordNumber),
      confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t.profilePasswordMismatch,
      path: ["confirmPassword"],
    });
}

interface ProfileFormValues {
  name: string;
  phone: string;
  address: string;
}

interface PasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ProfileSettingsPage(): JSX.Element {
  const { t, language } = useLanguage();
  const pageTitleRef = useScrollAwareTitle();
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const profileSchema = useMemo(() => makeProfileSchema(t), [t]);
  const passwordSchema = useMemo(() => makePasswordSchema(t), [t]);

  const { data, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: () => getMe(),
  });

  const me = data?.data;

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: "", phone: "", address: "" },
  });

  useEffect(() => {
    if (!me) return;
    profileForm.reset({
      name: me.name,
      phone: me.phone ?? "",
      address: me.address ?? "",
    });
  }, [me, profileForm]);

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const profileMutation = useMutation({
    mutationFn: (values: ProfileFormValues) => {
      const payload: UpdateMePayload = {
        name: values.name,
        phone: values.phone || undefined,
        address: values.address || undefined,
      };
      return updateMe(payload);
    },
    onSuccess: (res) => {
      if (res.success && res.data) {
        queryClient.setQueryData(["me"], res);
        dispatch(updateUserProfile({ name: res.data.name }));
        toast.success(t.profileUpdateSuccess);
      } else {
        toast.error(res.message[language]);
      }
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, language, t.unexpectedError));
    },
  });

  const passwordMutation = useMutation({
    mutationFn: (payload: ChangePasswordPayload) => changePassword(payload),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(t.profilePasswordChangeSuccess);
        passwordForm.reset({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        toast.error(res.message[language]);
      }
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, language, t.unexpectedError));
    },
  });

  function onSubmitProfile(values: ProfileFormValues): void {
    profileMutation.mutate(values);
  }

  function onSubmitPassword(values: PasswordFormValues): void {
    passwordMutation.mutate({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 ref={pageTitleRef} className="text-2xl font-bold tracking-tight text-foreground">
          {t.profileSettings}
        </h2>
        <p className="mt-0.5 text-sm text-muted-foreground">{t.profilePageSubtitle}</p>
      </div>

      {me?.mustChangePassword && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-300">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          {t.profileMustChangePasswordBanner}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr,360px]">
          <div className="space-y-6">
            {/* Profile information */}
            <Card>
              <CardHeader className="flex flex-row items-center gap-3 space-y-0">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <UserRound className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">{t.profileInfoSectionTitle}</CardTitle>
                  <CardDescription>{t.profileInfoSectionDesc}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={profileForm.handleSubmit(onSubmitProfile)} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="profile-name">
                      {t.profileNameLabel}
                      <span className="ml-0.5 text-destructive">*</span>
                    </Label>
                    <Controller
                      name="name"
                      control={profileForm.control}
                      render={({ field }) => (
                        <Input
                          id="profile-name"
                          placeholder={t.profileNamePlaceholder}
                          disabled={profileMutation.isPending}
                          {...field}
                          className={cn(
                            "rounded-xl",
                            profileForm.formState.errors.name &&
                              "border-destructive focus-visible:ring-destructive/30"
                          )}
                        />
                      )}
                    />
                    {profileForm.formState.errors.name && (
                      <p className="flex items-center gap-1 text-xs text-destructive">
                        <AlertCircle className="h-3 w-3 shrink-0" />
                        {profileForm.formState.errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="profile-email">{t.profileEmailLabel}</Label>
                    <Input id="profile-email" value={me?.email ?? ""} disabled className="rounded-xl" />
                    <p className="text-xs text-muted-foreground/70">{t.profileEmailHint}</p>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="profile-phone">{t.profilePhoneLabel}</Label>
                    <Controller
                      name="phone"
                      control={profileForm.control}
                      render={({ field }) => (
                        <Input
                          id="profile-phone"
                          placeholder={t.profilePhonePlaceholder}
                          disabled={profileMutation.isPending}
                          {...field}
                          className="rounded-xl"
                        />
                      )}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="profile-address">{t.profileAddressLabel}</Label>
                    <Controller
                      name="address"
                      control={profileForm.control}
                      render={({ field }) => (
                        <Input
                          id="profile-address"
                          placeholder={t.profileAddressPlaceholder}
                          disabled={profileMutation.isPending}
                          {...field}
                          className="rounded-xl"
                        />
                      )}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={profileMutation.isPending}
                      className="min-w-[8rem] rounded-xl"
                    >
                      {profileMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          {t.profileSaving}
                        </>
                      ) : (
                        t.profileSaveChanges
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Change password */}
            <Card>
              <CardHeader className="flex flex-row items-center gap-3 space-y-0">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <KeyRound className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">{t.profilePasswordSectionTitle}</CardTitle>
                  <CardDescription>{t.profilePasswordSectionDesc}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={passwordForm.handleSubmit(onSubmitPassword)} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="profile-current-password">{t.profileCurrentPasswordLabel}</Label>
                    <Controller
                      name="currentPassword"
                      control={passwordForm.control}
                      render={({ field }) => (
                        <div className="relative">
                          <Input
                            id="profile-current-password"
                            type={showCurrentPassword ? "text" : "password"}
                            autoComplete="current-password"
                            disabled={passwordMutation.isPending}
                            {...field}
                            className={cn(
                              "rounded-xl pr-10",
                              passwordForm.formState.errors.currentPassword &&
                                "border-destructive focus-visible:ring-destructive/30"
                            )}
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword((p) => !p)}
                            tabIndex={-1}
                            aria-label={showCurrentPassword ? t.hidePassword : t.showPassword}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 transition-colors hover:text-muted-foreground"
                          >
                            {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      )}
                    />
                    {passwordForm.formState.errors.currentPassword && (
                      <p className="flex items-center gap-1 text-xs text-destructive">
                        <AlertCircle className="h-3 w-3 shrink-0" />
                        {passwordForm.formState.errors.currentPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="profile-new-password">{t.profileNewPasswordLabel}</Label>
                    <Controller
                      name="newPassword"
                      control={passwordForm.control}
                      render={({ field }) => (
                        <div className="relative">
                          <Input
                            id="profile-new-password"
                            type={showNewPassword ? "text" : "password"}
                            autoComplete="new-password"
                            disabled={passwordMutation.isPending}
                            {...field}
                            className={cn(
                              "rounded-xl pr-10",
                              passwordForm.formState.errors.newPassword &&
                                "border-destructive focus-visible:ring-destructive/30"
                            )}
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword((p) => !p)}
                            tabIndex={-1}
                            aria-label={showNewPassword ? t.hidePassword : t.showPassword}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 transition-colors hover:text-muted-foreground"
                          >
                            {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      )}
                    />
                    {passwordForm.formState.errors.newPassword ? (
                      <p className="flex items-center gap-1 text-xs text-destructive">
                        <AlertCircle className="h-3 w-3 shrink-0" />
                        {passwordForm.formState.errors.newPassword.message}
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground/70">{t.profileNewPasswordHint}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="profile-confirm-password">{t.profileConfirmPasswordLabel}</Label>
                    <Controller
                      name="confirmPassword"
                      control={passwordForm.control}
                      render={({ field }) => (
                        <Input
                          id="profile-confirm-password"
                          type={showNewPassword ? "text" : "password"}
                          autoComplete="new-password"
                          disabled={passwordMutation.isPending}
                          {...field}
                          className={cn(
                            "rounded-xl",
                            passwordForm.formState.errors.confirmPassword &&
                              "border-destructive focus-visible:ring-destructive/30"
                          )}
                        />
                      )}
                    />
                    {passwordForm.formState.errors.confirmPassword && (
                      <p className="flex items-center gap-1 text-xs text-destructive">
                        <AlertCircle className="h-3 w-3 shrink-0" />
                        {passwordForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={passwordMutation.isPending}
                      className="min-w-[10rem] rounded-xl"
                    >
                      {passwordMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          {t.profileChangingPassword}
                        </>
                      ) : (
                        t.profileChangePasswordButton
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Current placement (read-only) */}
          <Card className="h-fit">
            <CardHeader className="flex flex-row items-center gap-3 space-y-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Building2 className="h-4 w-4 text-primary" />
              </div>
              <CardTitle className="text-base">{t.profilePlacementSectionTitle}</CardTitle>
            </CardHeader>
            <CardContent>
              {me?.currentPlacement ? (
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{t.profilePlacementPharmacyLabel}</span>
                    <span className="font-medium text-foreground">{me.currentPlacement.pharmacy.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{t.profilePlacementRoleLabel}</span>
                    <span className="font-medium text-foreground">{me.currentPlacement.role.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{t.profilePlacementJoinedLabel}</span>
                    <span className="font-medium text-foreground">
                      {formatDate(me.currentPlacement.joinedAt)}
                    </span>
                  </div>
                  {me.currentPlacement.activeLicense && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">{t.profilePlacementLicenseLabel}</span>
                      <span className="font-medium text-foreground">
                        {me.currentPlacement.activeLicense.licenseNumber}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">{t.profilePlacementNone}</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/utils/apiError";

import { login, selectPharmacy } from "@/service/authService";
import { setLoginCredentials, setFullAuth } from "@/store/authSlice";
import { useLanguage } from "@/hooks/useLanguage";
import { clearToken, storeToken } from "@/utils/tokenStore";
import { changePassword } from "@/service/meService";
import type { AppDispatch } from "@/store";
import type { BilingualMessage } from "@/types/api";

const FALLBACK_ERROR: BilingualMessage = {
  en: "An unexpected error occurred. Please try again.",
  id: "Terjadi kesalahan yang tidak terduga. Silakan coba lagi.",
};

interface UseLoginReturn {
  submit: (email: string, password: string) => void;
  isPending: boolean;
  /** Set when the account signed in with a temporary password that must be replaced first. */
  passwordChangeFor: string | null;
  completePasswordChange: (newPassword: string) => Promise<void>;
  cancelPasswordChange: () => void;
}

export function useLogin(): UseLoginReturn {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { language, t } = useLanguage();
  const [isAutoSelecting, setIsAutoSelecting] = useState(false);
  const lastPasswordRef = useRef("");
  const [pendingChange, setPendingChange] = useState<{ email: string; password: string } | null>(null);
  const [isChanging, setIsChanging] = useState(false);

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: async (response) => {
      if (!response.success || !response.data) {
        toast.error((response.message ?? FALLBACK_ERROR)[language]);
        return;
      }

      const { user, currentPharmacy, accessToken } = response.data;

      // Temporary password: replace it before entering. The token stays in memory
      // only (no Redux login yet) so the guards don't route anywhere meanwhile.
      if (user.mustChangePassword) {
        storeToken(accessToken);
        setPendingChange({ email: user.email, password: lastPasswordRef.current });
        return;
      }
      const pharmacies = user.accessiblePharmacies;
      const isPlatformUser = user.platformRole !== null;
      const isOwner = pharmacies.some((p) => p.role?.type === "OWNER");
      const shouldAutoSelect =
        !isPlatformUser && !isOwner && pharmacies.length === 1 && !currentPharmacy;

      if (!shouldAutoSelect) {
        // Normal path: dispatch login state, GuestGuard handles redirect
        dispatch(setLoginCredentials(response.data));
        toast.success(t.loginSuccessTitle, { id: "auth-redirect", description: t.loginSuccessDesc });
        navigate(currentPharmacy ? "/dashboard" : "/");
        return;
      }

      // Single-placement non-owner: inline select so we never render Dashboard A.
      // Put the token in the in-memory store first so axios can use it without a Redux dispatch
      // (dispatching setLoginCredentials here would cause GuestGuard to flash / to the user).
      storeToken(accessToken);
      setIsAutoSelecting(true);

      try {
        const selectResponse = await selectPharmacy({ pharmacyUuid: pharmacies[0].uuid });

        if (selectResponse.success && selectResponse.data) {
          // Atomic: isAuthenticated=true + pharmacySelected=true in one dispatch.
          // GuestGuard jumps straight to /dashboard with no intermediate render of /.
          dispatch(setFullAuth(selectResponse.data));
          toast.success(t.loginSuccessTitle, { id: "auth-redirect", description: t.loginSuccessDirectDesc });
          navigate("/dashboard");
        } else {
          // Auto-select failed — fall back to Dashboard A so user can pick manually
          dispatch(setLoginCredentials(response.data));
          toast.success(t.loginSuccessTitle, { id: "auth-redirect", description: t.loginSuccessDesc });
          navigate("/");
        }
      } catch {
        dispatch(setLoginCredentials(response.data));
        toast.success(t.loginSuccessTitle, { id: "auth-redirect", description: t.loginSuccessDesc });
        navigate("/");
      } finally {
        setIsAutoSelecting(false);
      }
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, language, FALLBACK_ERROR[language]));
    },
  });

  function submit(email: string, password: string): void {
    lastPasswordRef.current = password;
    mutation.mutate({ email, password });
  }

  async function completePasswordChange(newPassword: string): Promise<void> {
    if (!pendingChange) return;
    setIsChanging(true);
    try {
      await changePassword({ currentPassword: pendingChange.password, newPassword });
      // Changing the password ends every session, so sign in again with the new one.
      const email = pendingChange.email;
      setPendingChange(null);
      submit(email, newPassword);
    } catch (error) {
      toast.error(getApiErrorMessage(error, language, FALLBACK_ERROR[language]));
    } finally {
      setIsChanging(false);
    }
  }

  function cancelPasswordChange(): void {
    clearToken();
    setPendingChange(null);
  }

  return {
    submit,
    isPending: mutation.isPending || isAutoSelecting || isChanging,
    passwordChangeFor: pendingChange?.email ?? null,
    completePasswordChange,
    cancelPasswordChange,
  };
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { getApiErrorMessage } from "@/utils/apiError";

import { selectPharmacy } from "@/service/authService";
import { setPharmacy } from "@/store/authSlice";
import { useLanguage } from "@/hooks/useLanguage";
import { useLogout } from "@/hooks/useLogout";
import type { AppDispatch } from "@/store";
import type { BilingualMessage } from "@/types/api";
import { clearQueryCache } from "@/utils/queryPersister";
import { PHARMACY_NAV_GROUPS, filterNavGroups } from "@/configs/navigation";
import { hasPermission } from "@/hooks/usePermission";

const FALLBACK_ERROR: BilingualMessage = {
  en: "An unexpected error occurred. Please try again.",
  id: "Terjadi kesalahan yang tidak terduga. Silakan coba lagi.",
};

interface UseSelectPharmacyReturn {
  select: (pharmacyUuid: string) => void;
  signOut: () => void;
  selectingUuid: string | null;
  isSelecting: boolean;
  isLoggingOut: boolean;
}

export function useSelectPharmacy(): UseSelectPharmacyReturn {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { language } = useLanguage();
  const queryClient = useQueryClient();
  const { signOut, isLoggingOut } = useLogout();
  const [selectingUuid, setSelectingUuid] = useState<string | null>(null);

  const selectMutation = useMutation({
    mutationFn: selectPharmacy,
    onSuccess: async (response) => {
      if (!response.success || !response.data) {
        const msg = response.message ?? FALLBACK_ERROR;
        toast.error(msg[language]);
        setSelectingUuid(null);
        return;
      }
      sessionStorage.removeItem("switching_pharmacy");
      // Never let the previous pharmacy's cached data (customers, stock, prescriptions…) bleed into this one.
      await clearQueryCache(queryClient);
      dispatch(setPharmacy(response.data));
      // Land on the first page this role can open, rather than a dashboard it may not have access to.
      const isPlatformAdmin = response.data.user?.platformRole === "PLATFORM_ADMIN";
      const can = (check: Parameters<typeof hasPermission>[2]) =>
        hasPermission(response.data!.currentPharmacy.permissions, isPlatformAdmin, check);
      navigate(filterNavGroups(PHARMACY_NAV_GROUPS, can)[0]?.items[0]?.path ?? "/profile");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, language, FALLBACK_ERROR[language]));
      setSelectingUuid(null);
      // Password was reset while signed in: sign out so the login page can ask for a new one.
      if (isAxiosError(error) && error.response?.data?.code === "PASSWORD_CHANGE_REQUIRED") signOut();
    },
  });

  function select(pharmacyUuid: string): void {
    setSelectingUuid(pharmacyUuid);
    selectMutation.mutate({ pharmacyUuid });
  }

  return {
    select,
    signOut,
    selectingUuid,
    isSelecting: selectMutation.isPending,
    isLoggingOut,
  };
}

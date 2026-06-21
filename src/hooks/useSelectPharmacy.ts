import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/utils/apiError";

import { selectPharmacy } from "@/service/authService";
import { setPharmacy } from "@/store/authSlice";
import { useLanguage } from "@/hooks/useLanguage";
import { useLogout } from "@/hooks/useLogout";
import type { AppDispatch } from "@/store";
import type { BilingualMessage } from "@/types/api";

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
  const { signOut, isLoggingOut } = useLogout();
  const [selectingUuid, setSelectingUuid] = useState<string | null>(null);

  const selectMutation = useMutation({
    mutationFn: selectPharmacy,
    onSuccess: (response) => {
      if (!response.success || !response.data) {
        const msg = response.message ?? FALLBACK_ERROR;
        toast.error(msg[language]);
        setSelectingUuid(null);
        return;
      }
      sessionStorage.removeItem("switching_pharmacy");
      dispatch(setPharmacy(response.data));
      navigate("/dashboard");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, language, FALLBACK_ERROR[language]));
      setSelectingUuid(null);
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

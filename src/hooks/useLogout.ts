import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";

import { logoutUser } from "@/service/authService";
import { logout } from "@/store/authSlice";
import type { AppDispatch } from "@/store";
import { clearQueryCache } from "@/utils/queryPersister";

interface UseLogoutReturn {
  signOut: () => void;
  isLoggingOut: boolean;
}

export function useLogout(): UseLogoutReturn {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();

  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSettled: async () => {
      await clearQueryCache(queryClient);
      dispatch(logout());
      sessionStorage.setItem("auth_redirect_reason", "logout_success");
      navigate("/login");
    },
  });

  function signOut(): void {
    logoutMutation.mutate();
  }

  return {
    signOut,
    isLoggingOut: logoutMutation.isPending,
  };
}

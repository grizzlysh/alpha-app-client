import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";

import { getMe } from "@/service/authService";
import { restoreSession, logout } from "@/store/authSlice";
import { TOKEN_KEY } from "@/utils/constants";
import type { AppDispatch } from "@/store";

interface UseBootstrapAuthReturn {
  isBootstrapping: boolean;
}

export function useBootstrapAuth(): UseBootstrapAuthReturn {
  const dispatch = useDispatch<AppDispatch>();
  const hasToken = !!localStorage.getItem(TOKEN_KEY);
  // Start as "restored" when there's no token so the router renders immediately.
  // When a token exists, stay true until restoreSession has been dispatched.
  const [sessionRestored, setSessionRestored] = useState(!hasToken);

  const { data, isError } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: getMe,
    enabled: hasToken,
    retry: false,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (!data) return;
    if (data.success && data.data) {
      const isSwitching = sessionStorage.getItem("switching_pharmacy") === "true";
      if (isSwitching) {
        dispatch(restoreSession({ user: data.data.user, currentPharmacy: null }));
      } else {
        dispatch(restoreSession(data.data));
      }
    }
    // Mark restored AFTER dispatch so the router sees the correct auth state on first render.
    setSessionRestored(true);
  }, [data, dispatch]);

  // Any failure (network down or HTTP error) means we cannot verify the session.
  // Clear auth state and send to login rather than leaving the user in a broken state.
  useEffect(() => {
    if (isError) {
      dispatch(logout());
      sessionStorage.setItem("auth_redirect_reason", "session_expired");
      window.location.replace("/login");
    }
  }, [isError, dispatch]);

  return { isBootstrapping: !sessionRestored };
}

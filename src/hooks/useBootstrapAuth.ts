import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";

import { getMe } from "@/service/authService";
import { restoreSession, logout } from "@/store/authSlice";
import { getToken, hasSessionHint } from "@/utils/tokenStore";
import { refreshSession } from "@/configs/axiosInstance";
import type { AppDispatch } from "@/store";

interface UseBootstrapAuthReturn {
  isBootstrapping: boolean;
}

export function useBootstrapAuth(): UseBootstrapAuthReturn {
  const dispatch = useDispatch<AppDispatch>();
  // The access token is memory-only, so after a reload it has to be re-issued
  // from the refresh cookie. Only try when this browser had a session.
  const hasSession = hasSessionHint();
  // Start as "restored" when there's no session so the router renders immediately.
  // Otherwise stay false until restoreSession has been dispatched.
  const [sessionRestored, setSessionRestored] = useState(!hasSession);

  const { data, isError } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      if (!getToken()) await refreshSession();
      return getMe();
    },
    enabled: hasSession,
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

import type { JSX } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import type { RootState } from "@/store";

// Allows platform users (no pharmacy required) OR any authenticated user
// who has a pharmacy selected. Used for pages like /users and /roles that
// exist in both the global-admin context and the pharmacy-staff context.
export function SharedAccessGuard(): JSX.Element {
  const { isAuthenticated, user, pharmacySelected } = useSelector(
    (state: RootState) => state.auth
  );

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const isPlatformUser = user !== null && user.platformRole !== null;

  if (!isPlatformUser && !pharmacySelected) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

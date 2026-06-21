import type { JSX } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import type { RootState } from "@/store";

export function AuthGuard(): JSX.Element {
  const { isAuthenticated, user, pharmacySelected } = useSelector(
    (state: RootState) => state.auth
  );

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const isPlatformUser = user !== null && user.platformRole !== null;
  if (!isPlatformUser) {
    return <Navigate to={pharmacySelected ? "/dashboard" : "/"} replace />;
  }

  return <Outlet />;
}

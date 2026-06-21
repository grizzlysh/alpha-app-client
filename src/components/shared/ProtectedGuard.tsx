import type { JSX } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import type { RootState } from "@/store";

export function ProtectedGuard(): JSX.Element {
  const { isAuthenticated, pharmacySelected } = useSelector(
    (state: RootState) => state.auth
  );

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!pharmacySelected) return <Navigate to="/" replace />;

  return <Outlet />;
}

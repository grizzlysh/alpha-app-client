import type { JSX } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import type { RootState } from "@/store";

export function HomeGuard(): JSX.Element {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <Outlet />;
}

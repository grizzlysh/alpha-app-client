import type { JSX } from "react";
import { Outlet, useLocation } from "react-router-dom";

import { useCan, type PermissionCheck } from "@/hooks/usePermission";
import { PHARMACY_ROUTE_PERMISSIONS } from "@/configs/navigation";
import StatusPage from "@/pages/StatusPage";

interface PermissionGateProps {
  /** Explicit permission; defaults to the one registered for the current path in navigation. */
  perm?: PermissionCheck;
}

/**
 * Route-level guard: shows an in-layout "no access" page instead of mounting a
 * page whose API calls would all fail with 403.
 */
export function PermissionGate({ perm }: PermissionGateProps): JSX.Element {
  const can = useCan();
  const { pathname } = useLocation();
  const required = perm ?? PHARMACY_ROUTE_PERMISSIONS[pathname];
  if (!can(required)) return <StatusPage kind="forbidden" />;
  return <Outlet />;
}

import type { JSX, ReactNode } from "react";
import { useCan, type PermissionCheck } from "@/hooks/usePermission";

interface CanProps {
  /** `module.action`, or an array meaning "any of". */
  perm: PermissionCheck;
  children: ReactNode;
  fallback?: ReactNode;
}

/** Renders children only when the current user holds the permission. */
export function Can({ perm, children, fallback = null }: CanProps): JSX.Element {
  const can = useCan();
  return <>{can(perm) ? children : fallback}</>;
}

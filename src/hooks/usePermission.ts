import { useCallback } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";

/**
 * A permission key in `module.action` form, e.g. "sales.create".
 * Passing an array means "any of these".
 */
export type PermissionKey = string;
export type PermissionCheck = PermissionKey | PermissionKey[] | undefined;

type PermissionMap = Record<string, Record<string, boolean | undefined> | undefined>;

export function hasPermission(
  permissions: PermissionMap,
  isPlatformAdmin: boolean,
  check: PermissionCheck
): boolean {
  if (check === undefined) return true;
  // Mirrors the server: PLATFORM_ADMIN bypasses every permission check.
  if (isPlatformAdmin) return true;
  const keys = Array.isArray(check) ? check : [check];
  return keys.some((key) => {
    const dot = key.indexOf(".");
    if (dot === -1) return false;
    return permissions[key.slice(0, dot)]?.[key.slice(dot + 1)] === true;
  });
}

/**
 * Returns `can(check)` for hiding UI the current user cannot use.
 * This is a UX convenience only — the server remains the authority.
 */
export function useCan(): (check: PermissionCheck) => boolean {
  const permissions = useSelector((state: RootState) => state.auth.permissions) as PermissionMap;
  const isPlatformAdmin = useSelector(
    (state: RootState) => state.auth.user?.platformRole === "PLATFORM_ADMIN"
  );
  return useCallback(
    (check: PermissionCheck) => hasPermission(permissions, isPlatformAdmin, check),
    [permissions, isPlatformAdmin]
  );
}

import type { JSX } from "react";
import { useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Key, Loader2, Search } from "lucide-react";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLanguage } from "@/hooks/useLanguage";
import { getApiErrorMessage } from "@/utils/apiError";
import type { RoleDetail, Permission } from "@/types/role";
import { getPermissions } from "@/service/permissionService";
import { setRolePermissions } from "@/service/roleService";

export interface RolePermissionsModalProps {
  role: RoleDetail;
  onClose: () => void;
  onSuccess: (updated: RoleDetail) => void;
}

export function RolePermissionsModal({
  role,
  onClose,
  onSuccess,
}: RolePermissionsModalProps): JSX.Element {
  const queryClient = useQueryClient();
  const { t, language } = useLanguage();

  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(role.permissions.map((p) => p.uuid))
  );

  const { data: permissionsData, isLoading } = useQuery({
    queryKey: ["permissions-all"],
    queryFn: () => getPermissions(),
    staleTime: 10 * 60 * 1000,
  });

  const allGroups = useMemo(
    () => permissionsData?.data ?? [],
    [permissionsData?.data]
  );

  const filteredGroups = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return allGroups;
    return allGroups
      .map((group) => ({
        ...group,
        permissions: group.permissions.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.module.toLowerCase().includes(q) ||
            (p.description?.toLowerCase().includes(q) ?? false)
        ),
      }))
      .filter((group) => group.permissions.length > 0);
  }, [allGroups, search]);

  const allPermissions = useMemo<Permission[]>(
    () => allGroups.flatMap((g) => g.permissions),
    [allGroups]
  );

  const allFilteredPermissions = useMemo<Permission[]>(
    () => filteredGroups.flatMap((g) => g.permissions),
    [filteredGroups]
  );

  const allFilteredSelected =
    allFilteredPermissions.length > 0 &&
    allFilteredPermissions.every((p) => selected.has(p.uuid));

  function togglePermission(uuid: string): void {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(uuid)) next.delete(uuid);
      else next.add(uuid);
      return next;
    });
  }

  function toggleAllFiltered(): void {
    if (allFilteredSelected) {
      setSelected((prev) => {
        const next = new Set(prev);
        allFilteredPermissions.forEach((p) => next.delete(p.uuid));
        return next;
      });
    } else {
      setSelected((prev) => {
        const next = new Set(prev);
        allFilteredPermissions.forEach((p) => next.add(p.uuid));
        return next;
      });
    }
  }

  function toggleGroupAll(groupPerms: Permission[]): void {
    const allChecked = groupPerms.every((p) => selected.has(p.uuid));
    setSelected((prev) => {
      const next = new Set(prev);
      if (allChecked) groupPerms.forEach((p) => next.delete(p.uuid));
      else groupPerms.forEach((p) => next.add(p.uuid));
      return next;
    });
  }

  const mutation = useMutation({
    mutationFn: () =>
      setRolePermissions(role.uuid, {
        permissionUuids: Array.from(selected),
      }),
    onSuccess: (res) => {
      if (res.success && res.data) {
        queryClient.invalidateQueries({ queryKey: ["roles"] });
        queryClient.invalidateQueries({ queryKey: ["role", role.uuid] });
        toast.success(t.rolePermissionsSuccess);
        onSuccessRef.current(res.data);
      } else {
        toast.error(res.message[language]);
      }
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, language, t.unexpectedError));
    },
  });

  const isPending = mutation.isPending;

  const selectedCountInAll = allPermissions.filter((p) =>
    selected.has(p.uuid)
  ).length;

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !isPending) onClose();
      }}
    >
      <DialogContent
        className="flex max-h-[90vh] max-w-xl flex-col gap-0 p-0"
        onInteractOutside={(e) => {
          if (isPending) e.preventDefault();
        }}
      >
        {/* Header */}
        <DialogHeader className="flex flex-row items-center gap-3 space-y-0 border-b border-border px-6 py-4">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <Key className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <DialogTitle className="text-base">
              {t.rolePermissionsTitle}
            </DialogTitle>
            <p className="mt-0.5 truncate text-xs uppercase text-muted-foreground">
              {role.name} · {selectedCountInAll} {t.rolePermissionCount}
            </p>
          </div>
        </DialogHeader>

        {/* Search + select-all bar */}
        <div className="border-b border-border px-5 py-3">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-9 flex-1 items-center gap-2 rounded-xl border border-border bg-background px-3",
                "transition-all duration-150",
                "focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
              )}
            >
              <Search className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t.rolePermissionsSearchPlaceholder}
                className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
              />
            </div>
            <button
              type="button"
              onClick={toggleAllFiltered}
              className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
            >
              {allFilteredSelected
                ? t.rolePermissionsDeselectAll
                : t.rolePermissionsSelectAll}
            </button>
          </div>
        </div>

        {/* Permission groups */}
        <div className="flex-1 overflow-y-auto">
          {isLoading && (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}

          {!isLoading && filteredGroups.length === 0 && (
            <div className="py-16 text-center text-sm text-muted-foreground">
              {t.rolePermissionsNoResults}
            </div>
          )}

          {!isLoading &&
            filteredGroups.map((group) => {
              const groupAllChecked = group.permissions.every((p) =>
                selected.has(p.uuid)
              );
              const groupSomeChecked =
                !groupAllChecked &&
                group.permissions.some((p) => selected.has(p.uuid));

              return (
                <div key={group.module} className="border-b border-border/60 last:border-0">
                  {/* Group header */}
                  <div className="flex items-center gap-3 bg-muted/40 px-5 py-2.5">
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={groupAllChecked}
                        ref={(el) => {
                          if (el) el.indeterminate = groupSomeChecked;
                        }}
                        onChange={() => toggleGroupAll(group.permissions)}
                        className="h-4 w-4 rounded accent-primary"
                      />
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {group.module}
                      </span>
                    </label>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {group.permissions.filter((p) => selected.has(p.uuid))
                        .length}
                      /{group.permissions.length}
                    </span>
                  </div>

                  {/* Permissions */}
                  <div className="divide-y divide-border/40">
                    {group.permissions.map((perm) => (
                      <label
                        key={perm.uuid}
                        className="flex cursor-pointer items-start gap-3 px-5 py-3 transition-colors hover:bg-accent/40"
                      >
                        <input
                          type="checkbox"
                          checked={selected.has(perm.uuid)}
                          onChange={() => togglePermission(perm.uuid)}
                          className="mt-0.5 h-4 w-4 rounded accent-primary"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-foreground">
                            {perm.name}
                          </p>
                          {perm.description && (
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              {perm.description}
                            </p>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t border-border px-6 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isPending}
            className="rounded-xl"
          >
            {t.cancel}
          </Button>
          <Button
            type="button"
            disabled={isPending || isLoading}
            onClick={() => mutation.mutate()}
            className="min-w-[10rem] rounded-xl"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t.rolePermissionsSaving}
              </>
            ) : (
              t.rolePermissionsSave
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

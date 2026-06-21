import type { JSX } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ShieldCheck, Loader2, Search, AlertCircle } from "lucide-react";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/hooks/useLanguage";
import type { Translations } from "@/configs/i18n";
import { getApiErrorMessage } from "@/utils/apiError";
import type {
  Role,
  PharmacyRole,
  RecordStatus,
  Permission,
  CreateRolePayload,
  UpdateRolePayload,
} from "@/types/role";
import {
  createRole,
  updateRole,
  setRolePermissions,
  getRole,
} from "@/service/roleService";
import { getPermissions } from "@/service/permissionService";

// ── Schema ────────────────────────────────────────────────────────────────────

function makeSchema(t: Translations, isEdit: boolean) {
  return z.object({
    name: z.string().trim().min(1, t.roleNameRequired).max(100),
    type: isEdit
      ? z.enum(["OWNER", "ADMIN", "PHARMACIST", "HEAD_PHARMACIST", "CASHIER"] as const).optional()
      : z.enum(["OWNER", "ADMIN", "PHARMACIST", "HEAD_PHARMACIST", "CASHIER"] as const, {
          message: t.roleTypeRequired,
        }),
    requiresLicense: z.boolean().optional(),
    status: z.enum(["ACTIVE", "INACTIVE", "DELETED"] as const).optional(),
  });
}

interface FormValues {
  name: string;
  type?: PharmacyRole;
  requiresLicense?: boolean;
  status?: RecordStatus;
}

// ── Permissions section ───────────────────────────────────────────────────────

interface PermissionsSectionProps {
  allPermissions: Permission[];
  filteredGroups: { module: string; permissions: Permission[] }[];
  selected: Set<string>;
  search: string;
  isLoading: boolean;
  onSearch: (v: string) => void;
  onToggle: (uuid: string) => void;
  onToggleGroup: (perms: Permission[]) => void;
  onToggleAll: () => void;
  t: Translations;
}

function PermissionsSection({
  allPermissions,
  filteredGroups,
  selected,
  search,
  isLoading,
  onSearch,
  onToggle,
  onToggleGroup,
  onToggleAll,
  t,
}: PermissionsSectionProps): JSX.Element {
  const allFilteredPerms = filteredGroups.flatMap((g) => g.permissions);
  const allFilteredSelected =
    allFilteredPerms.length > 0 &&
    allFilteredPerms.every((p) => selected.has(p.uuid));
  const selectedCount = allPermissions.filter((p) => selected.has(p.uuid)).length;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label>
          {t.rolePermissionsTitle}
          <span className="ml-2 text-xs font-normal text-muted-foreground">
            {selectedCount} {t.rolePermissionCount}
          </span>
        </Label>
        <button
          type="button"
          onClick={onToggleAll}
          className="text-xs font-medium text-primary hover:underline"
        >
          {allFilteredSelected
            ? t.rolePermissionsDeselectAll
            : t.rolePermissionsSelectAll}
        </button>
      </div>

      <div
        className={cn(
          "flex h-9 items-center gap-2 rounded-xl border border-border bg-background px-3",
          "transition-all duration-150",
          "focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
        )}
      >
        <Search className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={t.rolePermissionsSearchPlaceholder}
          className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
        />
      </div>

      <div className="max-h-56 overflow-y-auto rounded-xl border border-border">
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        )}

        {!isLoading && filteredGroups.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            {t.rolePermissionsNoResults}
          </p>
        )}

        {!isLoading &&
          filteredGroups.map((group, idx) => {
            const groupAllChecked = group.permissions.every((p) =>
              selected.has(p.uuid)
            );
            const groupSomeChecked =
              !groupAllChecked &&
              group.permissions.some((p) => selected.has(p.uuid));

            return (
              <div
                key={group.module}
                className={
                  idx < filteredGroups.length - 1
                    ? "border-b border-border/60"
                    : ""
                }
              >
                <div className="flex items-center gap-2 bg-muted/40 px-3 py-2">
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={groupAllChecked}
                      ref={(el) => {
                        if (el) el.indeterminate = groupSomeChecked;
                      }}
                      onChange={() => onToggleGroup(group.permissions)}
                      className="h-3.5 w-3.5 rounded accent-primary"
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

                <div className="divide-y divide-border/40">
                  {group.permissions.map((perm) => (
                    <label
                      key={perm.uuid}
                      className="flex cursor-pointer items-start gap-2.5 px-3 py-2.5 transition-colors hover:bg-accent/40"
                    >
                      <input
                        type="checkbox"
                        checked={selected.has(perm.uuid)}
                        onChange={() => onToggle(perm.uuid)}
                        className="mt-0.5 h-3.5 w-3.5 rounded accent-primary"
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
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export interface RoleFormModalProps {
  mode: "create" | "edit";
  role?: Role;
  onClose: () => void;
  onSuccess: () => void;
}

export function RoleFormModal({
  mode,
  role,
  onClose,
  onSuccess,
}: RoleFormModalProps): JSX.Element {
  const queryClient = useQueryClient();
  const { t, language } = useLanguage();
  const isEdit = mode === "edit";
  const schema = useMemo(() => makeSchema(t, isEdit), [t, isEdit]);

  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  // ── Permission selection state ────────────────────────────────────────────
  const [selectedPerms, setSelectedPerms] = useState<Set<string>>(
    () => new Set()
  );
  const [permSearch, setPermSearch] = useState("");

  // All available permissions
  const { data: permissionsData, isLoading: isLoadingPerms } = useQuery({
    queryKey: ["permissions-all"],
    queryFn: () => getPermissions(),
    staleTime: 10 * 60 * 1000,
  });

  // Current role's assigned permissions (edit only, may already be cached)
  const { data: roleDetailData, isLoading: isLoadingDetail } = useQuery({
    queryKey: ["role", role?.uuid],
    queryFn: () => getRole(role!.uuid),
    enabled: isEdit && !!role,
    staleTime: 0,
  });

  // Pre-populate selection from role detail once loaded
  useEffect(() => {
    if (roleDetailData?.data?.permissions) {
      setSelectedPerms(
        new Set(roleDetailData.data.permissions.map((p) => p.uuid))
      );
    }
  }, [roleDetailData]);

  const allGroups = useMemo(
    () => permissionsData?.data ?? [],
    [permissionsData?.data]
  );
  const allPermissions = useMemo(
    () => allGroups.flatMap((g) => g.permissions),
    [allGroups]
  );

  const filteredGroups = useMemo(() => {
    const q = permSearch.trim().toLowerCase();
    if (!q) return allGroups;
    return allGroups
      .map((g) => ({
        ...g,
        permissions: g.permissions.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.module.toLowerCase().includes(q)
        ),
      }))
      .filter((g) => g.permissions.length > 0);
  }, [allGroups, permSearch]);

  function togglePerm(uuid: string): void {
    setSelectedPerms((prev) => {
      const next = new Set(prev);
      if (next.has(uuid)) next.delete(uuid);
      else next.add(uuid);
      return next;
    });
  }

  function toggleGroup(perms: Permission[]): void {
    const allChecked = perms.every((p) => selectedPerms.has(p.uuid));
    setSelectedPerms((prev) => {
      const next = new Set(prev);
      if (allChecked) perms.forEach((p) => next.delete(p.uuid));
      else perms.forEach((p) => next.add(p.uuid));
      return next;
    });
  }

  function toggleAllFiltered(): void {
    const allFiltered = filteredGroups.flatMap((g) => g.permissions);
    const allChecked = allFiltered.every((p) => selectedPerms.has(p.uuid));
    setSelectedPerms((prev) => {
      const next = new Set(prev);
      if (allChecked) allFiltered.forEach((p) => next.delete(p.uuid));
      else allFiltered.forEach((p) => next.add(p.uuid));
      return next;
    });
  }

  // ── Form ──────────────────────────────────────────────────────────────────
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: role?.name ?? "",
      type: role?.type ?? undefined,
      requiresLicense: role?.requiresLicense ?? false,
      status: role?.status ?? undefined,
    },
  });

  function handleMutationError(error: unknown): void {
    toast.error(getApiErrorMessage(error, language, t.unexpectedError));
  }

  // Create: createRole → setRolePermissions sequentially
  const createMutation = useMutation({
    mutationFn: async (payload: CreateRolePayload) => {
      const res = await createRole(payload);
      if (!res.success || !res.data) {
        throw Object.assign(new Error(), { _apiMessage: res.message });
      }
      await setRolePermissions(res.data.uuid, {
        permissionUuids: Array.from(selectedPerms),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      onSuccessRef.current();
    },
    onError: (error: unknown) => {
      const apiMsg = (error as { _apiMessage?: { en: string; id: string } })
        ._apiMessage;
      if (apiMsg) {
        toast.error(apiMsg[language]);
        return;
      }
      handleMutationError(error);
    },
  });

  // Edit: updateRole (if meta changed) + setRolePermissions sequentially
  const updateMutation = useMutation({
    mutationFn: async ({
      uuid,
      values,
    }: {
      uuid: string;
      values: FormValues;
    }) => {
      const metaPayload: UpdateRolePayload = {};
      if (values.name !== role?.name) metaPayload.name = values.name;
      if ((values.requiresLicense ?? false) !== (role?.requiresLicense ?? false))
        metaPayload.requiresLicense = values.requiresLicense ?? false;
      if (values.status && values.status !== role?.status)
        metaPayload.status = values.status;

      if (Object.keys(metaPayload).length > 0) {
        const res = await updateRole(uuid, metaPayload);
        if (!res.success) {
          throw Object.assign(new Error(), { _apiMessage: res.message });
        }
      }

      await setRolePermissions(uuid, {
        permissionUuids: Array.from(selectedPerms),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      queryClient.invalidateQueries({ queryKey: ["role", role?.uuid] });
      onSuccessRef.current();
    },
    onError: (error: unknown) => {
      const apiMsg = (error as { _apiMessage?: { en: string; id: string } })
        ._apiMessage;
      if (apiMsg) {
        toast.error(apiMsg[language]);
        return;
      }
      handleMutationError(error);
    },
  });

  const isPending = createMutation.isPending || updateMutation.isPending;
  const isLoadingPermData = isLoadingPerms || (isEdit && isLoadingDetail);

  function onSubmit(values: FormValues): void {
    if (mode === "create" && values.type) {
      createMutation.mutate({
        name: values.name,
        type: values.type,
        requiresLicense: values.requiresLicense ?? false,
      });
    } else if (isEdit && role) {
      updateMutation.mutate({ uuid: role.uuid, values });
    }
  }

  const fieldError = (key: keyof FormValues) =>
    form.formState.errors[key]?.message;

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !isPending) onClose();
      }}
    >
      <DialogContent
        className="flex max-h-[90vh] max-w-xl flex-col overflow-hidden p-0"
        onInteractOutside={(e) => {
          if (isPending) e.preventDefault();
        }}
      >
        <DialogHeader className="flex shrink-0 flex-row items-center gap-3 space-y-0 border-b border-border px-6 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
            <ShieldCheck className="h-4 w-4 text-primary" />
          </div>
          <DialogTitle className="text-base">
            {isEdit ? t.roleEdit : t.roleAdd}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
            <div className="space-y-4">
              {/* Name */}
              <div className="space-y-1.5">
                <Label htmlFor="role-name">
                  {t.roleName}
                  <span className="ml-0.5 text-destructive">*</span>
                </Label>
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <Input
                      id="role-name"
                      placeholder={t.roleNamePlaceholder}
                      {...field}
                      className={cn(
                        fieldError("name") &&
                          "border-destructive focus-visible:ring-destructive/30"
                      )}
                    />
                  )}
                />
                {fieldError("name") && (
                  <p className="flex items-center gap-1 text-xs text-destructive">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    {fieldError("name")}
                  </p>
                )}
              </div>

              {/* Type — create only */}
              {!isEdit && (
                <div className="space-y-1.5">
                  <Label htmlFor="role-type">
                    {t.roleType}
                    <span className="ml-0.5 text-destructive">*</span>
                  </Label>
                  <Controller
                    name="type"
                    control={form.control}
                    render={({ field }) => (
                      <Combobox
                        value={field.value ?? ""}
                        onValueChange={field.onChange}
                        options={[
                          { value: "OWNER", label: t.roleTypeOwner },
                          { value: "ADMIN", label: t.roleTypeAdmin },
                          { value: "PHARMACIST", label: t.roleTypePharmacist },
                          { value: "HEAD_PHARMACIST", label: t.roleTypeHeadPharmacist },
                          { value: "CASHIER", label: t.roleTypeCashier },
                        ]}
                        placeholder={t.roleSelectType}
                        className={cn(
                          fieldError("type") &&
                            "border-destructive focus:ring-destructive/30"
                        )}
                      />
                    )}
                  />
                  {fieldError("type") && (
                    <p className="flex items-center gap-1 text-xs text-destructive">
                      <AlertCircle className="h-3 w-3 shrink-0" />
                      {fieldError("type")}
                    </p>
                  )}
                </div>
              )}

              {/* Status — edit only */}
              {isEdit && (
                <div className="space-y-1.5">
                  <Label htmlFor="role-status">{t.roleStatus}</Label>
                  <Controller
                    name="status"
                    control={form.control}
                    render={({ field }) => (
                      <Select
                        value={field.value ?? ""}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger id="role-status">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ACTIVE">
                            {t.roleStatusActive}
                          </SelectItem>
                          <SelectItem value="INACTIVE">
                            {t.roleStatusInactive}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              )}

              {/* Requires License */}
              <div className="space-y-1.5">
                <Label>{t.roleRequiresLicense}</Label>
                <Controller
                  name="requiresLicense"
                  control={form.control}
                  render={({ field }) => (
                    <Select
                      value={field.value ? "true" : "false"}
                      onValueChange={(v) => field.onChange(v === "true")}
                    >
                      <SelectTrigger id="role-requires-license">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">{t.roleRequiresLicenseYes}</SelectItem>
                        <SelectItem value="false">{t.roleRequiresLicenseNo}</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              {/* Permissions — both create and edit */}
              <PermissionsSection
                allPermissions={allPermissions}
                filteredGroups={filteredGroups}
                selected={selectedPerms}
                search={permSearch}
                isLoading={isLoadingPermData}
                onSearch={setPermSearch}
                onToggle={togglePerm}
                onToggleGroup={toggleGroup}
                onToggleAll={toggleAllFiltered}
                t={t}
              />
            </div>
          </div>

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
              type="submit"
              disabled={isPending || isLoadingPermData}
              className="min-w-[6rem] rounded-xl"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t.roleSaving}
                </>
              ) : (
                t.roleSave
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

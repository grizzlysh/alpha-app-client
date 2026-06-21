import type { JSX } from "react";
import { useQuery } from "@tanstack/react-query";
import { Pencil, Trash2, UserRoundKey, Loader2 } from "lucide-react";

import type { Translations } from "@/configs/i18n";
import type { Role } from "@/types/role";
import { getRole } from "@/service/roleService";
import { DetailModal, InfoPair, DetailDatesCard } from "@/components/shared/DetailModal";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  getRoleInitials,
  getRoleAvatarColor,
  getRoleTypeLabel,
  getRoleStatusLabel,
  formatDate,
} from "./roleUtils";

// ── RoleDetailPanel ───────────────────────────────────────────────────────────

export interface RoleDetailPanelProps {
  role: Role;
  t: Translations;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function RoleDetailPanel({
  role,
  t,
  onClose,
  onEdit,
  onDelete,
}: RoleDetailPanelProps): JSX.Element {
  const { data, isLoading } = useQuery({
    queryKey: ["role", role.uuid],
    queryFn: () => getRole(role.uuid),
  });

  const detail = data?.data ?? null;

  return (
    <DetailModal
      icon={<UserRoundKey className="h-4 w-4 text-primary" />}
      title={t.roleDetailsTitle}
      onClose={onClose}
      actions={[
        { label: t.roleEdit, icon: <Pencil className="h-4 w-4" />, variant: "outline", onClick: onEdit },
        { label: t.roleDelete, icon: <Trash2 className="h-4 w-4" />, variant: "destructive", onClick: onDelete },
      ]}
    >
      {/* Hero */}
      <div className="flex items-center gap-4 px-5 py-6">
        <div
          className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl text-sm font-bold ${getRoleAvatarColor(role.name)}`}
        >
          {getRoleInitials(role.name)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-lg font-bold uppercase text-foreground">{role.name}</p>
          <StatusBadge
            status={role.status}
            label={getRoleStatusLabel(role.status, t)}
            className="mt-1"
          />
        </div>
      </div>

      <div className="mx-5 border-t border-border" />

      {/* Info pairs */}
      <div className="divide-y divide-border px-5">
        <InfoPair label={t.roleType} value={getRoleTypeLabel(role.type, t)} />
        <InfoPair label={t.roleIsGlobal} value={role.isGlobal ? t.roleScopeGlobal : t.roleScopePharmacy} />
        <InfoPair label={t.roleRequiresLicense} value={role.requiresLicense ? t.roleRequiresLicenseYes : t.roleRequiresLicenseNo} />

        {/* Permissions */}
        <div className="py-2.5">
          <span className="text-sm text-muted-foreground">{t.rolePermissionsTitle}</span>
          {isLoading ? (
            <div className="mt-2">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          ) : detail && detail.permissions.length > 0 ? (
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {detail.permissions.map((perm) => (
                <span
                  key={perm.uuid}
                  className="rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-foreground"
                >
                  {perm.name}
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-1 text-sm text-muted-foreground/40">{t.rolePermissionsNone}</p>
          )}
        </div>
      </div>

      {/* Dates */}
      <DetailDatesCard
        className="mt-auto"
        rows={[
          { label: t.created, value: formatDate(role.createdAt) },
          { label: t.lastUpdated, value: formatDate(role.updatedAt) },
        ]}
      />
    </DetailModal>
  );
}

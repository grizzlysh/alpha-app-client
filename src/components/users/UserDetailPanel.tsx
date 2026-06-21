import type { JSX } from "react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  FileBadge,
  History,
  Hospital,
  Pencil,
  Trash2,
  Plus,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Users,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Translations } from "@/configs/i18n";
import type { UserListItem, PlacementItem, PlacementGroup, LicenseItem } from "@/types/user";
import { getUserPlacements } from "@/service/userService";
import {
  getUserInitials,
  getUserAvatarColor,
  getPlatformRoleLabel,
  getUserStatusLabel,
  getPlacementStatusLabel,
  formatDate,
} from "./userUtils";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { DetailModal, InfoPair, DetailDatesCard } from "@/components/shared/DetailModal";
import { UserPlacementFormModal } from "./UserPlacementFormModal";
import { UserPlacementDeleteModal } from "./UserPlacementDeleteModal";
import { UserLicenseFormModal } from "./UserLicenseFormModal";
import { UserLicenseDeleteModal } from "./UserLicenseDeleteModal";
import { UserLicenseHistoryModal } from "./UserLicenseHistoryModal";

// ── Local modal state ─────────────────────────────────────────────────────────

type SubModal =
  | { mode: "create-placement" }
  | { mode: "edit-placement"; placement: PlacementItem }
  | { mode: "delete-placement"; placement: PlacementItem }
  | { mode: "create-license"; placement: PlacementItem }
  | { mode: "edit-license"; placement: PlacementItem; license: LicenseItem }
  | { mode: "delete-license"; placement: PlacementItem; license: LicenseItem }
  | { mode: "view-license-history"; placement: PlacementItem }
  | null;

// ── TenureRow ─────────────────────────────────────────────────────────────────

interface TenureRowProps {
  tenure: PlacementItem;
  t: Translations;
  onEdit: () => void;
  onDelete: () => void;
  onAddLicense: () => void;
  onEditLicense: (license: LicenseItem) => void;
  onDeleteLicense: (license: LicenseItem) => void;
  onViewHistory: () => void;
}

function TenureRow({
  tenure,
  t,
  onEdit,
  onDelete,
  onAddLicense,
  onEditLicense,
  onDeleteLicense,
  onViewHistory,
}: TenureRowProps): JSX.Element {
  const license = tenure.activeLicense;

  return (
    <div className="px-3.5 py-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground">{tenure.role.name}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {formatDate(tenure.joinedAt)}
            {tenure.leftAt
              ? ` → ${formatDate(tenure.leftAt)}`
              : ` → ${t.placementPresent}`}
          </p>
        </div>
        <div className="flex flex-shrink-0 items-center gap-2">
          <StatusBadge
            status={tenure.status}
            label={getPlacementStatusLabel(tenure.status, t)}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              >
                <MoreVertical className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 rounded-xl">
              <DropdownMenuItem onClick={onEdit} className="gap-2.5 rounded-lg">
                <Pencil className="h-4 w-4 text-muted-foreground" />
                {t.placementEdit}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onViewHistory} className="gap-2.5 rounded-lg">
                <History className="h-4 w-4 text-muted-foreground" />
                {t.licenseHistory}
              </DropdownMenuItem>
              {license ? (
                <>
                  <DropdownMenuItem
                    onClick={() => onEditLicense(license)}
                    className="gap-2.5 rounded-lg"
                  >
                    <FileBadge className="h-4 w-4 text-muted-foreground" />
                    {t.licenseEdit}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onDeleteLicense(license)}
                    className="gap-2.5 rounded-lg text-destructive focus:bg-destructive/10 focus:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    {t.licenseDelete}
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem onClick={onAddLicense} className="gap-2.5 rounded-lg">
                  <FileBadge className="h-4 w-4 text-muted-foreground" />
                  {t.licenseAdd}
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={onDelete}
                className="gap-2.5 rounded-lg text-destructive focus:bg-destructive/10 focus:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                {t.placementDelete}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="mt-2">
        {license ? (
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs">
              <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-success" />
              <span className="font-medium text-success">{t.licenseActiveBadge}</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground">{license.licenseNumber}</span>
            </div>
            <p className="pl-5 text-xs text-muted-foreground">
              {formatDate(license.validFrom)} → {formatDate(license.validUntil)}
            </p>
          </div>
        ) : (
          <button
            type="button"
            onClick={onAddLicense}
            className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <XCircle className="h-3.5 w-3.5 flex-shrink-0" />
            <span>{t.licenseNoLicense}</span>
            <span>·</span>
            <span className="text-primary hover:underline"> {t.licenseAdd}</span>
          </button>
        )}
      </div>
    </div>
  );
}

// ── PharmacyGroupCard ─────────────────────────────────────────────────────────

interface PharmacyGroupCardProps {
  group: PlacementGroup;
  t: Translations;
  onEdit: (placement: PlacementItem) => void;
  onDelete: (placement: PlacementItem) => void;
  onAddLicense: (placement: PlacementItem) => void;
  onEditLicense: (placement: PlacementItem, license: LicenseItem) => void;
  onDeleteLicense: (placement: PlacementItem, license: LicenseItem) => void;
  onViewHistory: (placement: PlacementItem) => void;
}

function PharmacyGroupCard({
  group,
  t,
  onEdit,
  onDelete,
  onAddLicense,
  onEditLicense,
  onDeleteLicense,
  onViewHistory,
}: PharmacyGroupCardProps): JSX.Element {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center gap-2 bg-muted/30 px-3.5 py-2.5">
        <Hospital className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">
            {group.pharmacy.name}
          </p>
          <p className="text-xs text-muted-foreground">{group.pharmacy.code}</p>
        </div>
      </div>

      <div className="divide-y divide-border/50">
        {group.tenures.map((tenure) => (
          <TenureRow
            key={tenure.uuid}
            tenure={tenure}
            t={t}
            onEdit={() => onEdit(tenure)}
            onDelete={() => onDelete(tenure)}
            onAddLicense={() => onAddLicense(tenure)}
            onEditLicense={(license) => onEditLicense(tenure, license)}
            onDeleteLicense={(license) => onDeleteLicense(tenure, license)}
            onViewHistory={() => onViewHistory(tenure)}
          />
        ))}
      </div>
    </div>
  );
}

// ── UserDetailPanel ───────────────────────────────────────────────────────────

export interface UserDetailPanelProps {
  user: UserListItem;
  t: Translations;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function UserDetailPanel({
  user,
  t,
  onClose,
  onEdit,
  onDelete,
}: UserDetailPanelProps): JSX.Element {
  const [subModal, setSubModal] = useState<SubModal>(null);

  const { data: groupsData, isLoading: placementsLoading } = useQuery({
    queryKey: ["user-placements", user.uuid],
    queryFn: () => getUserPlacements(user.uuid),
  });

  const groups = groupsData?.data ?? [];

  function closeSubModal(): void {
    setSubModal(null);
  }

  return (
    <>
      <DetailModal
        icon={<Users className="h-4 w-4 text-primary" />}
        title={t.userDetailsTitle}
        onClose={onClose}
        actions={[
          { label: t.userEdit, icon: <Pencil className="h-4 w-4" />, variant: "outline", onClick: onEdit },
          { label: t.userDelete, icon: <Trash2 className="h-4 w-4" />, variant: "destructive", onClick: onDelete },
        ]}
      >
        {/* Hero */}
        <div className="flex items-center gap-4 px-5 py-6">
          <div
            className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl text-sm font-bold ${getUserAvatarColor(user.name)}`}
          >
            {getUserInitials(user.name)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-lg font-bold text-foreground">{user.name}</p>
            <StatusBadge
              status={user.status}
              label={getUserStatusLabel(user.status, t)}
              className="mt-1"
            />
          </div>
        </div>

        <div className="mx-5 border-t border-border" />

        {/* Info pairs */}
        <div className="divide-y divide-border px-5">
          <InfoPair label={t.userEmail} value={user.email} />
          <InfoPair label={t.userPhone} value={user.phone} />
          <InfoPair label={t.userAddress} value={user.address} />
          <InfoPair label={t.userPlatformRole} value={getPlatformRoleLabel(user.platformRole, t)} />
        </div>

        {/* Placements section */}
        <div className="mx-5 border-t border-border" />
        <div className="px-5 py-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Hospital className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-semibold text-foreground">
                {t.placementSectionTitle}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSubModal({ mode: "create-placement" })}
              className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/10 whitespace-nowrap"
            >
              <Plus className="h-3 w-3" />
              {t.add}
            </button>
          </div>

          {placementsLoading ? (
            <div className="space-y-2">
              {[1, 2].map((i) => (
                <div key={i} className="h-24 animate-pulse rounded-xl bg-muted" />
              ))}
            </div>
          ) : groups.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border py-8 text-center">
              <Hospital className="h-8 w-8 text-muted-foreground/30" />
              <p className="text-sm font-medium text-muted-foreground">
                {t.placementEmptyTitle}
              </p>
              <p className="text-xs text-muted-foreground/60">{t.placementEmptyDesc}</p>
              <button
                type="button"
                onClick={() => setSubModal({ mode: "create-placement" })}
                className="mt-1 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
              >
                <Plus className="h-3.5 w-3.5" />
                {t.add}
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {groups.map((group) => (
                <PharmacyGroupCard
                  key={group.pharmacy.uuid}
                  group={group}
                  t={t}
                  onEdit={(p) => setSubModal({ mode: "edit-placement", placement: p })}
                  onDelete={(p) => setSubModal({ mode: "delete-placement", placement: p })}
                  onAddLicense={(p) => setSubModal({ mode: "create-license", placement: p })}
                  onEditLicense={(p, l) => setSubModal({ mode: "edit-license", placement: p, license: l })}
                  onDeleteLicense={(p, l) => setSubModal({ mode: "delete-license", placement: p, license: l })}
                  onViewHistory={(p) => setSubModal({ mode: "view-license-history", placement: p })}
                />
              ))}
            </div>
          )}
        </div>

        {/* Dates */}
        <DetailDatesCard
          className="mt-auto"
          rows={[
            { label: t.created, value: formatDate(user.createdAt) },
            { label: t.lastUpdated, value: formatDate(user.updatedAt) },
          ]}
        />
      </DetailModal>

      {/* Sub-modals rendered outside the Sheet (portaled to body) */}
      {subModal?.mode === "create-placement" && (
        <UserPlacementFormModal
          mode="create"
          userUuid={user.uuid}
          onClose={closeSubModal}
          onSuccess={closeSubModal}
        />
      )}

      {subModal?.mode === "edit-placement" && (
        <UserPlacementFormModal
          mode="edit"
          userUuid={user.uuid}
          placement={subModal.placement}
          onClose={closeSubModal}
          onSuccess={closeSubModal}
        />
      )}

      {subModal?.mode === "delete-placement" && (
        <UserPlacementDeleteModal
          userUuid={user.uuid}
          placement={subModal.placement}
          onClose={closeSubModal}
          onSuccess={closeSubModal}
        />
      )}

      {subModal?.mode === "create-license" && (
        <UserLicenseFormModal
          mode="create"
          userUuid={user.uuid}
          placement={subModal.placement}
          onClose={closeSubModal}
          onSuccess={closeSubModal}
        />
      )}

      {subModal?.mode === "edit-license" && (
        <UserLicenseFormModal
          mode="edit"
          userUuid={user.uuid}
          placement={subModal.placement}
          license={subModal.license}
          onClose={closeSubModal}
          onSuccess={closeSubModal}
        />
      )}

      {subModal?.mode === "delete-license" && (
        <UserLicenseDeleteModal
          userUuid={user.uuid}
          placement={subModal.placement}
          license={subModal.license}
          onClose={closeSubModal}
          onSuccess={closeSubModal}
        />
      )}

      {subModal?.mode === "view-license-history" && (
        <UserLicenseHistoryModal
          userUuid={user.uuid}
          placement={subModal.placement}
          onClose={closeSubModal}
        />
      )}
    </>
  );
}

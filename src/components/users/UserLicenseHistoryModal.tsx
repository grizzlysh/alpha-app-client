import type { JSX } from "react";
import { useQuery } from "@tanstack/react-query";
import { FileBadge, Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLanguage } from "@/hooks/useLanguage";
import type { PlacementItem } from "@/types/user";
import { getLicenses } from "@/service/userService";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatDate, getUserStatusLabel } from "./userUtils";

export interface UserLicenseHistoryModalProps {
  userUuid: string;
  placement: PlacementItem;
  onClose: () => void;
}

export function UserLicenseHistoryModal({
  userUuid,
  placement,
  onClose,
}: UserLicenseHistoryModalProps): JSX.Element {
  const { t } = useLanguage();

  const { data, isLoading } = useQuery({
    queryKey: ["licenses", userUuid, placement.uuid],
    queryFn: () => getLicenses(userUuid, placement.uuid),
    staleTime: 30 * 1000,
  });

  const licenses = data?.data ?? [];

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-md p-0">
        <DialogHeader className="flex flex-row items-center gap-3 space-y-0 border-b border-border px-6 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
            <FileBadge className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <DialogTitle className="text-base">{t.licenseHistory}</DialogTitle>
            <p className="mt-0.5 truncate text-xs uppercase text-muted-foreground">
              {placement.role.name}
            </p>
          </div>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto px-6 py-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : licenses.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10 text-center">
              <FileBadge className="h-8 w-8 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">{t.licenseHistoryEmpty}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {licenses.map((license) => (
                <div
                  key={license.uuid}
                  className="flex items-start justify-between gap-3 rounded-xl border border-border p-3.5"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {license.licenseNumber}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {formatDate(license.validFrom)} → {formatDate(license.validUntil)}
                    </p>
                  </div>
                  <StatusBadge
                    status={license.status}
                    label={getUserStatusLabel(license.status, t)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

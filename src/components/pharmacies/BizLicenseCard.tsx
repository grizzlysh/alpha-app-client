import type { JSX } from "react";
import {
  CheckCircle2,
  MoreVertical,
  Pencil,
  Trash2,
  XCircle,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type { Translations } from "@/configs/i18n";
import type { BusinessLicense } from "@/types/businessLicense";
import { formatDate, getBizLicenseStatusLabel } from "./pharmacyUtils";

export interface BizLicenseCardProps {
  license: BusinessLicense;
  t: Translations;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function BizLicenseCard({
  license,
  t,
  onEdit,
  onDelete,
}: BizLicenseCardProps): JSX.Element {
  const isActive = license.status === "ACTIVE";
  return (
    <div className="rounded-xl border border-border bg-card p-3.5">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium uppercase text-foreground">
            {license.licenseNumber}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatDate(license.validFrom)} → {formatDate(license.validUntil)}
          </p>
        </div>
        <div className="flex flex-shrink-0 items-center gap-2">
          <StatusBadge
            status={license.status}
            label={getBizLicenseStatusLabel(license.status, t)}
          />
          {(onEdit || onDelete) && (
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
                {onEdit && (
                  <DropdownMenuItem
                    onClick={onEdit}
                    className="gap-2.5 rounded-lg"
                  >
                    <Pencil className="h-4 w-4 text-muted-foreground" />
                    {t.licenseEdit}
                  </DropdownMenuItem>
                )}
                {onEdit && onDelete && <DropdownMenuSeparator />}
                {onDelete && (
                  <DropdownMenuItem
                    onClick={onDelete}
                    className="gap-2.5 rounded-lg text-destructive focus:bg-destructive/10 focus:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    {t.licenseDelete}
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      <div className="mt-2.5">
        {isActive ? (
          <div className="flex items-center gap-1.5 text-xs">
            <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-success" />
            <span className="font-medium text-success">
              {t.licenseActiveBadge}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <XCircle className="h-3.5 w-3.5 flex-shrink-0" />
            <span>{getBizLicenseStatusLabel(license.status, t)}</span>
          </div>
        )}
      </div>
    </div>
  );
}

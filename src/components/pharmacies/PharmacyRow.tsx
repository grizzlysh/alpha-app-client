import type { JSX } from "react";
import { MoreVertical, Eye, Pencil, Trash2 } from "lucide-react";

import { cn } from "@/utils/cn";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Translations } from "@/configs/i18n";
import type { Pharmacy } from "@/types/pharmacy";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  getPharmacyInitials,
  getPharmacyAvatarColor,
  getPharmacyCategoryLabel,
  getPharmacyStatusLabel,
} from "./pharmacyUtils";

export interface PharmacyRowProps {
  pharmacy: Pharmacy;
  t: Translations;
  onDetails: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function PharmacyRow({
  pharmacy,
  t,
  onDetails,
  onEdit,
  onDelete,
}: PharmacyRowProps): JSX.Element {
  return (
    <tr className="group transition-colors hover:bg-accent/40">
      {/* Sticky left: avatar + name/code */}
      <td className="md:sticky md:left-0 z-[1] min-w-[220px] border-r border-border/40 bg-card px-5 py-4 transition-colors group-hover:bg-accent">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-sm font-bold",
              getPharmacyAvatarColor(pharmacy.name)
            )}
          >
            {getPharmacyInitials(pharmacy.name)}
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium text-foreground">
              {pharmacy.name}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {pharmacy.code}
            </p>
          </div>
        </div>
      </td>

      {/* Category — sm+ */}
      <td className="hidden min-w-[130px] px-5 py-4 sm:table-cell">
        <span className="text-sm text-foreground">
          {getPharmacyCategoryLabel(pharmacy.category, t)}
        </span>
      </td>

      {/* Status — always */}
      <td className="min-w-[110px] px-5 py-4">
        <StatusBadge status={pharmacy.status} label={getPharmacyStatusLabel(pharmacy.status, t)} />
      </td>

      {/* Sticky right: action menu */}
      <td className="md:sticky md:right-0 z-[1] w-14 border-l border-border/40 bg-card px-3 py-4 transition-colors group-hover:bg-accent">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 rounded-xl">
            <DropdownMenuItem
              onClick={onDetails}
              className="gap-2.5 rounded-lg"
            >
              <Eye className="h-4 w-4 text-muted-foreground" />
              {t.pharmaDetails}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onEdit} className="gap-2.5 rounded-lg">
              <Pencil className="h-4 w-4 text-muted-foreground" />
              {t.pharmaEdit}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onDelete}
              className="gap-2.5 rounded-lg text-destructive focus:bg-destructive/10 focus:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              {t.pharmaDelete}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}

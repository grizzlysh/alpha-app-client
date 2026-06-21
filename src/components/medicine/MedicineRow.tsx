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
import type { Medicine } from "@/types/medicine";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { getInitials, getAvatarColor } from "./medicineUtils";

export interface MedicineRowProps {
  medicine: Medicine;
  t: Translations;
  onDetails: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function MedicineRow({
  medicine,
  t,
  onDetails,
  onEdit,
  onDelete,
}: MedicineRowProps): JSX.Element {
  const isActive = medicine.status.toUpperCase() === "ACTIVE";

  return (
    <tr className="group transition-colors hover:bg-accent/40">
      {/* Sticky left: avatar + name */}
      <td className="md:sticky md:left-0 z-[1] min-w-[220px] border-r border-border/40 bg-card px-5 py-4 transition-colors group-hover:bg-accent">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-sm font-bold",
              getAvatarColor(medicine.name)
            )}
          >
            {getInitials(medicine.name)}
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium uppercase text-foreground">
              {medicine.name}
            </p>
            {medicine.ingredients.length > 0 && (
              <p className="truncate text-xs text-muted-foreground">
                {medicine.ingredients.map((i) => i.name).join(", ")}
              </p>
            )}
          </div>
        </div>
      </td>

      {/* Shape — md+ */}
      <td className="hidden min-w-[120px] px-5 py-4 md:table-cell">
        {medicine.medicineShape ? (
          <span className="text-sm text-foreground">{medicine.medicineShape.name}</span>
        ) : (
          <span className="text-muted-foreground/40">—</span>
        )}
      </td>

      {/* Type — lg+ */}
      <td className="hidden min-w-[120px] px-5 py-4 lg:table-cell">
        {medicine.medicineType ? (
          <span className="text-sm text-foreground">{medicine.medicineType.name}</span>
        ) : (
          <span className="text-muted-foreground/40">—</span>
        )}
      </td>

      {/* Unit — sm+ */}
      <td className="hidden min-w-[80px] px-5 py-4 sm:table-cell">
        <span className="text-sm text-foreground">{medicine.unit}</span>
      </td>

      {/* Status — always */}
      <td className="min-w-[100px] px-5 py-4">
        <StatusBadge
          status={medicine.status}
          label={isActive ? t.medicineStatusActive : t.medicineStatusInactive}
        />
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
          <DropdownMenuContent align="end" className="w-44 rounded-xl">
            <DropdownMenuItem
              onClick={onDetails}
              className="gap-2.5 rounded-lg"
            >
              <Eye className="h-4 w-4 text-muted-foreground" />
              {t.medicineDetails}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onEdit} className="gap-2.5 rounded-lg">
              <Pencil className="h-4 w-4 text-muted-foreground" />
              {t.medicineEdit}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onDelete}
              className="gap-2.5 rounded-lg text-destructive focus:bg-destructive/10 focus:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              {t.medicineDelete}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}

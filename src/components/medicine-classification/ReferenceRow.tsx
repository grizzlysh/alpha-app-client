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
import type { ReferenceItem, ReferenceLabels } from "./referenceTypes";
import { getInitials, getAvatarColor } from "./referenceUtils";
import { StatusBadge } from "@/components/shared/StatusBadge";

export interface ReferenceRowProps {
  item: ReferenceItem;
  labels: ReferenceLabels;
  onDetails: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function ReferenceRow({
  item,
  labels,
  onDetails,
  onEdit,
  onDelete,
}: ReferenceRowProps): JSX.Element {
  return (
    <tr className="group transition-colors hover:bg-accent/40">
      {/* Sticky left: avatar + name */}
      <td className="md:sticky md:left-0 z-[1] min-w-[220px] border-r border-border/40 bg-card px-5 py-4 transition-colors group-hover:bg-accent">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-sm font-bold",
              getAvatarColor(item.name)
            )}
          >
            {getInitials(item.name)}
          </div>
          <p className="truncate font-medium text-foreground">{item.name}</p>
        </div>
      </td>

      {/* Status — sm+ */}
      <td className="hidden min-w-[120px] px-5 py-4 sm:table-cell">
        <StatusBadge
          status={item.status}
          label={item.status.toUpperCase() === "ACTIVE" ? labels.statusActive : labels.statusInactive}
        />
      </td>

      {/* Required prescription — sm+, types only */}
      {labels.requiredPrescriptionLabel && (
        <td className="hidden min-w-[160px] px-5 py-4 sm:table-cell">
          {item.requiredPrescription ? (
            <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
              {labels.requiredPrescriptionYes}
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
              {labels.requiredPrescriptionNo}
            </span>
          )}
        </td>
      )}

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
              {labels.details}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onEdit} className="gap-2.5 rounded-lg">
              <Pencil className="h-4 w-4 text-muted-foreground" />
              {labels.editBtn}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onDelete}
              className="gap-2.5 rounded-lg text-destructive focus:bg-destructive/10 focus:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              {labels.deleteBtn}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}

import type { JSX } from "react";
import { MoreVertical, Eye } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Translations } from "@/configs/i18n";
import type { StockMovement } from "@/types/stockMovement";
import {
  getSMInitials,
  getSMAvatarColor,
  getSMTypeBadgeClass,
  getSMReasonLabel,
  formatQuantityChange,
  formatDate,
} from "./stockMovementUtils";

export interface StockMovementRowProps {
  movement: StockMovement;
  t: Translations;
  onDetails: () => void;
}

export function StockMovementRow({
  movement,
  t,
  onDetails,
}: StockMovementRowProps): JSX.Element {
  return (
    <tr className="group transition-colors hover:bg-accent/40">
      {/* Sticky left: avatar + medicine name + batch */}
      <td className="md:sticky md:left-0 z-[1] min-w-[240px] border-r border-border/40 bg-card px-5 py-4 transition-colors group-hover:bg-accent">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-xs font-bold ${getSMAvatarColor(movement.medicine.uuid)}`}
          >
            {getSMInitials(movement.medicine.name)}
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium uppercase text-foreground">
              {movement.medicine.name}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              <span className="uppercase">{movement.stockDetail.batchNumber}</span>
            </p>
          </div>
        </div>
      </td>

      {/* Type badge */}
      <td className="min-w-[110px] px-5 py-4">
        <span
          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${getSMTypeBadgeClass(movement.type)}`}
        >
          {movement.type === "IN" ? t.smTypeIn : t.smTypeOut}
        </span>
      </td>

      {/* Reason — sm+ */}
      <td className="hidden min-w-[140px] px-5 py-4 sm:table-cell">
        <span className="text-sm text-foreground">
          {getSMReasonLabel(movement.reason, t)}
        </span>
      </td>

      {/* Qty change — md+ */}
      <td className="hidden min-w-[120px] px-5 py-4 md:table-cell">
        <span
          className={`text-sm font-medium tabular-nums ${
            movement.type === "IN" ? "text-success" : "text-destructive"
          }`}
        >
          {formatQuantityChange(movement.type, movement.quantity, movement.medicine.unit)}
        </span>
      </td>

      {/* Reference — lg+ */}
      <td className="hidden min-w-[140px] px-5 py-4 lg:table-cell">
        <span className="text-sm text-foreground">
          {movement.reference ? (
            movement.reference.number
          ) : (
            <span className="text-muted-foreground/40">—</span>
          )}
        </span>
      </td>

      {/* Date — sm+ */}
      <td className="hidden min-w-[130px] px-5 py-4 sm:table-cell">
        <span className="text-sm text-foreground">{formatDate(movement.createdAt)}</span>
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
            <DropdownMenuItem onClick={onDetails} className="gap-2.5 rounded-lg">
              <Eye className="h-4 w-4 text-muted-foreground" />
              {t.smDetails}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}

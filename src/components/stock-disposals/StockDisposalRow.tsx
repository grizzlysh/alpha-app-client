import type { JSX } from "react";
import {
  MoreVertical,
  Eye,
  Pencil,
  Trash2,
  CheckCircle2,
  Ban,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Translations } from "@/configs/i18n";
import type { StockDisposal } from "@/types/stockDisposal";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  getSDStatusLabel,
  getSDInitials,
  getSDAvaterColor,
  canEdit,
  canComplete,
  canCancel,
  canDelete,
  formatDate,
} from "./stockDisposalUtils";

export interface StockDisposalRowProps {
  disposal: StockDisposal;
  t: Translations;
  onDetails: () => void;
  onEdit: () => void;
  onComplete: () => void;
  onCancel: () => void;
  onDelete: () => void;
}

export function StockDisposalRow({
  disposal,
  t,
  onDetails,
  onEdit,
  onComplete,
  onCancel,
  onDelete,
}: StockDisposalRowProps): JSX.Element {
  return (
    <tr className="group transition-colors hover:bg-accent/40">
      {/* Sticky left: avatar + disposal number */}
      <td className="md:sticky md:left-0 z-[1] min-w-[220px] border-r border-border/40 bg-card px-5 py-4 transition-colors group-hover:bg-accent">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-xs font-bold ${getSDAvaterColor(disposal.disposalNumber)}`}
          >
            {getSDInitials(disposal.disposalNumber)}
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium text-foreground">
              {disposal.disposalNumber}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {disposal.details.length}{" "}
              {disposal.details.length === 1 ? t.sdSingular : t.sdPlural}
            </p>
          </div>
        </div>
      </td>

      {/* Status */}
      <td className="min-w-[120px] px-5 py-4">
        <StatusBadge
          status={disposal.status}
          label={getSDStatusLabel(disposal.status, t)}
        />
      </td>

      {/* Items count — sm+ */}
      <td className="hidden min-w-[90px] px-5 py-4 sm:table-cell">
        <span className="text-sm text-foreground">
          {disposal.details.length}{" "}
          <span className="text-muted-foreground">{t.sdItemCount}</span>
        </span>
      </td>

      {/* Disposed At — md+ */}
      <td className="hidden min-w-[140px] px-5 py-4 md:table-cell">
        <span className="text-sm text-foreground">
          {disposal.disposedAt ? formatDate(disposal.disposedAt) : (
            <span className="text-muted-foreground/40">—</span>
          )}
        </span>
      </td>

      {/* Signed By — lg+ */}
      <td className="hidden min-w-[140px] px-5 py-4 lg:table-cell">
        <span className="text-sm text-foreground">
          {disposal.signedByUser ? disposal.signedByUser.name : (
            <span className="text-muted-foreground/40">—</span>
          )}
        </span>
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
              {t.sdDetails}
            </DropdownMenuItem>

            {canEdit(disposal.status) && (
              <DropdownMenuItem onClick={onEdit} className="gap-2.5 rounded-lg">
                <Pencil className="h-4 w-4 text-muted-foreground" />
                {t.sdEdit}
              </DropdownMenuItem>
            )}

            {canComplete(disposal.status) && (
              <DropdownMenuItem
                onClick={onComplete}
                className="gap-2.5 rounded-lg text-success focus:bg-success/10 focus:text-success"
              >
                <CheckCircle2 className="h-4 w-4" />
                {t.sdComplete}
              </DropdownMenuItem>
            )}

            {canCancel(disposal.status) && (
              <DropdownMenuItem
                onClick={onCancel}
                className="gap-2.5 rounded-lg text-destructive focus:bg-destructive/10 focus:text-destructive"
              >
                <Ban className="h-4 w-4" />
                {t.sdCancel}
              </DropdownMenuItem>
            )}

            {canDelete(disposal.status) && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={onDelete}
                  className="gap-2.5 rounded-lg text-destructive focus:bg-destructive/10 focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  {t.sdDelete}
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}

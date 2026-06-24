import type { JSX } from "react";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type { Translations } from "@/configs/i18n";
import type { StorageBin } from "@/types/storage";

export interface BinRowProps {
  bin: StorageBin;
  t: Translations;
  onEdit: () => void;
  onDelete: () => void;
}

export function BinRow({ bin, t, onEdit, onDelete }: BinRowProps): JSX.Element {
  const isActive = bin.status === "ACTIVE";

  return (
    <tr className="group transition-colors hover:bg-accent/40">
      {/* Sticky left: code + name */}
      <td className="md:sticky md:left-0 z-[1] min-w-[220px] border-r border-border/40 bg-card px-5 py-4 transition-colors group-hover:bg-accent">
        <div className="min-w-0">
          <p className="truncate font-medium uppercase text-foreground">{bin.name}</p>
          <p className="truncate text-xs text-muted-foreground">{bin.code}</p>
        </div>
      </td>

      {/* Description — md+ */}
      <td className="hidden min-w-[200px] px-5 py-4 md:table-cell">
        <span className="text-sm text-muted-foreground">
          {bin.description ?? "—"}
        </span>
      </td>

      {/* Status */}
      <td className="min-w-[110px] px-5 py-4">
        <StatusBadge
          status={bin.status}
          label={isActive ? t.storageStatusActive : t.storageStatusInactive}
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
          <DropdownMenuContent align="end" className="w-40 rounded-xl">
            <DropdownMenuItem onClick={onEdit} className="gap-2.5 rounded-lg">
              <Pencil className="h-4 w-4 text-muted-foreground" />
              {t.binEdit}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onDelete}
              className="gap-2.5 rounded-lg text-destructive focus:bg-destructive/10 focus:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              {t.binDelete}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}

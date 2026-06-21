import type { JSX } from "react";
import { MoreVertical, Eye, Pencil } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Translations } from "@/configs/i18n";
import type { Parameter } from "@/types/parameters";

export interface ParameterRowProps {
  parameter: Parameter;
  t: Translations;
  onDetails: () => void;
  onEdit: () => void;
}

export function ParameterRow({
  parameter,
  t,
  onDetails,
  onEdit,
}: ParameterRowProps): JSX.Element {
  return (
    <tr className="group transition-colors hover:bg-accent/40">
      {/* Key — sticky left */}
      <td className="md:sticky md:left-0 z-[1] min-w-[220px] border-r border-border/40 bg-card px-5 py-4 transition-colors group-hover:bg-accent">
        <p className="truncate font-mono text-sm font-medium text-foreground">
          {parameter.key}
        </p>
      </td>

      {/* Value — always */}
      <td className="min-w-[180px] px-5 py-4">
        <p className="truncate text-sm text-foreground">{parameter.value}</p>
      </td>

      {/* Description — sm+ */}
      <td className="hidden min-w-[200px] px-5 py-4 sm:table-cell">
        {parameter.description ? (
          <p className="truncate text-sm text-muted-foreground">
            {parameter.description}
          </p>
        ) : (
          <span className="text-muted-foreground/40">—</span>
        )}
      </td>

      {/* Updated — md+ */}
      <td className="hidden min-w-[140px] px-5 py-4 md:table-cell">
        <p className="text-sm text-muted-foreground">
          {new Date(parameter.updatedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </p>
      </td>

      {/* Actions — sticky right */}
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
            <DropdownMenuItem onClick={onDetails} className="gap-2.5 rounded-lg">
              <Eye className="h-4 w-4 text-muted-foreground" />
              {t.paramDetails}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onEdit} className="gap-2.5 rounded-lg">
              <Pencil className="h-4 w-4 text-muted-foreground" />
              {t.paramEdit}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}

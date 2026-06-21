import type { JSX } from "react";
import { MoreVertical, Eye, Pencil, Trash2, KeyRound } from "lucide-react";

import { cn } from "@/utils/cn";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Translations } from "@/configs/i18n";
import type { UserListItem } from "@/types/user";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  getUserInitials,
  getUserAvatarColor,
  getPlatformRoleLabel,
  getUserStatusLabel,
} from "./userUtils";

export interface UserRowProps {
  user: UserListItem;
  t: Translations;
  onDetails: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onResetPassword: () => void;
}

export function UserRow({
  user,
  t,
  onDetails,
  onEdit,
  onDelete,
  onResetPassword,
}: UserRowProps): JSX.Element {
  return (
    <tr className="group transition-colors hover:bg-accent/40">
      {/* Sticky left: avatar + name/email */}
      <td className="md:sticky md:left-0 z-[1] min-w-[220px] border-r border-border/40 bg-card px-5 py-4 transition-colors group-hover:bg-accent">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-sm font-bold",
              getUserAvatarColor(user.name)
            )}
          >
            {getUserInitials(user.name)}
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium uppercase text-foreground">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>
      </td>

      {/* Platform role — sm+ */}
      <td className="hidden min-w-[160px] px-5 py-4 sm:table-cell">
        <span className="text-sm text-foreground">
          {getPlatformRoleLabel(user.platformRole, t)}
        </span>
      </td>

      {/* Status — always */}
      <td className="min-w-[110px] px-5 py-4">
        <StatusBadge status={user.status} label={getUserStatusLabel(user.status, t)} />
      </td>

      {/* Placement count — lg+ */}
      <td className="hidden min-w-[130px] px-5 py-4 lg:table-cell">
        <span className="text-sm text-foreground">
          {user.placementCount}{" "}
          <span className="text-muted-foreground">{t.userPlacementCount}</span>
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
              {t.userDetails}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onEdit} className="gap-2.5 rounded-lg">
              <Pencil className="h-4 w-4 text-muted-foreground" />
              {t.userEdit}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onResetPassword}
              className="gap-2.5 rounded-lg"
            >
              <KeyRound className="h-4 w-4 text-muted-foreground" />
              {t.userResetPassword}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onDelete}
              className="gap-2.5 rounded-lg text-destructive focus:bg-destructive/10 focus:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              {t.userDelete}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}

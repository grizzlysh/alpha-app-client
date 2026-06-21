import type { JSX } from "react";
import { LogOut, Loader2, UserCog, UserRound } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/utils/cn";

interface UserMenuLabels {
  signOut: string;
  signingOut: string;
  profileSettings: string;
}

interface UserMenuProps {
  name: string;
  email: string;
  labels: UserMenuLabels;
  onSignOut: () => void;
  onProfileSettings: () => void;
  isSigningOut: boolean;
  disabled: boolean;
}

export function UserMenu({
  name,
  email,
  labels,
  onSignOut,
  onProfileSettings,
  isSigningOut,
  disabled,
}: UserMenuProps): JSX.Element {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="User menu"
          className={cn(
            "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl",
            "text-muted-foreground transition-all duration-150",
            "hover:bg-accent hover:text-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
            "data-[state=open]:bg-accent data-[state=open]:text-foreground"
          )}
        >
          <UserRound className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-60 rounded-2xl p-0">
        {/* Profile header */}
        <DropdownMenuLabel className="flex items-center gap-3 border-b border-border px-4 py-3.5">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <UserRound className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">
              {name}
            </p>
            <p className="truncate text-xs font-normal text-muted-foreground">
              {email}
            </p>
          </div>
        </DropdownMenuLabel>

        {/* Menu items */}
        <div className="p-1">
          <DropdownMenuItem
            onClick={() => !disabled && onProfileSettings()}
            className="gap-2.5 rounded-xl px-3 py-2 text-sm text-muted-foreground"
            disabled={disabled}
          >
            <UserCog className="h-4 w-4 flex-shrink-0" />
            {labels.profileSettings}
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator />

        {/* Sign out */}
        <div className="p-1">
          <DropdownMenuItem
            onClick={() => !disabled && onSignOut()}
            disabled={disabled}
            className="gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-destructive focus:bg-destructive/10 focus:text-destructive"
          >
            {isSigningOut ? (
              <Loader2 className="h-4 w-4 flex-shrink-0 animate-spin" />
            ) : (
              <LogOut className="h-4 w-4 flex-shrink-0" />
            )}
            {isSigningOut ? labels.signingOut : labels.signOut}
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

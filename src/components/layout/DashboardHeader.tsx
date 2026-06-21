import type { JSX } from "react";
import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Bell, Moon, Sun, Languages, Menu, WifiOff } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import { cn } from "@/utils/cn";
import { useLanguage } from "@/hooks/useLanguage";
import { useTheme } from "@/hooks/useTheme";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { useLogout } from "@/hooks/useLogout";
import { toggleMobileSidebar } from "@/store/uiSlice";
import { UserMenu } from "@/components/shared/UserMenu";
import type { AppDispatch, RootState } from "@/store";

function formatHeaderDate(date: Date, language: string): string {
  return date.toLocaleDateString(language === "id" ? "id-ID" : "en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

interface DashboardHeaderProps {
  pageTitle: string;
}

export function DashboardHeader({ pageTitle }: DashboardHeaderProps): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { t, language, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { signOut, isLoggingOut } = useLogout();
  const user = useSelector((state: RootState) => state.auth.user);
  const scrollAwareTitleEnabled = useSelector(
    (state: RootState) => state.ui.scrollAwareTitleEnabled
  );
  const headerShowPageTitle = useSelector(
    (state: RootState) => state.ui.headerShowPageTitle
  );
  const { isOnline } = useNetworkStatus();
  // Non-scroll-aware pages always show the title; scroll-aware pages let the
  // IntersectionObserver drive visibility.
  const showTitle = !scrollAwareTitleEnabled || headerShowPageTitle;
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const dateLabel = useMemo(
    () => formatHeaderDate(new Date(), language),
    [language]
  );

  const userMenuLabels = useMemo(
    () => ({
      signOut: t.signOut,
      signingOut: t.signingOut,
      profileSettings: t.profileSettings,
    }),
    [t]
  );

  return (
    <header className="sticky top-0 z-20 flex h-16 flex-shrink-0 items-center justify-between border-b border-border/50 bg-background/80 px-4 backdrop-blur-sm md:px-6">
      {/* Left: hamburger (mobile) + title + date */}
      <div className="flex items-center gap-3">
        {/* Hamburger — hidden on desktop since sidebar is always visible */}
        <button
          type="button"
          onClick={() => dispatch(toggleMobileSidebar())}
          aria-label="Open menu"
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-xl md:hidden",
            "text-muted-foreground transition-all duration-150",
            "hover:bg-accent hover:text-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          )}
        >
          <Menu className="h-4 w-4" />
        </button>

        <div className="flex items-center">
          {/* Title — animated in/out by scroll position on scroll-aware pages */}
          <div
            className={cn(
              "flex items-baseline gap-1.5 overflow-hidden whitespace-nowrap",
              showTitle
                ? "mr-1.5 max-w-xs opacity-100 transition-all duration-500 ease-in-out"
                : "mr-0 max-w-0 opacity-0 transition-all duration-300 ease-out"
            )}
          >
            <h1 className="text-sm font-bold text-foreground sm:text-base">
              {pageTitle}
            </h1>
            <span className="hidden text-muted-foreground/40 sm:inline">·</span>
          </div>
          <span className="hidden text-sm text-muted-foreground sm:inline">
            {dateLabel}
          </span>
          {!isOnline && (
            <span className="hidden items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-xs text-amber-700 sm:inline-flex dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
              <WifiOff className="h-3 w-3" />
              Cached
            </span>
          )}
        </div>
      </div>

      {/* Right: search · lang · theme · | · bell · | · profile */}
      <div className="flex items-center gap-2">
        {/* Search — hidden on mobile */}
        <div
          className={cn(
            "hidden items-center gap-2 rounded-xl border bg-background px-3 py-1.5 sm:flex",
            "transition-all duration-150",
            searchFocused
              ? "border-primary ring-2 ring-primary/20"
              : "border-border"
          )}
        >
          <Search className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
          <input
            ref={searchRef}
            type="search"
            placeholder={t.searchPlaceholder}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="w-44 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
          />
        </div>

        <div className="hidden h-4 w-px bg-border sm:block" />

        {/* Language toggle — hidden on mobile */}
        <button
          type="button"
          onClick={toggleLanguage}
          aria-label={language === "en" ? "Switch to Indonesian" : "Switch to English"}
          className={cn(
            "hidden h-8 w-[52px] items-center justify-center gap-1.5 rounded-xl sm:flex",
            "text-muted-foreground transition-all duration-150",
            "hover:bg-accent hover:text-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          )}
        >
          <Languages className="h-3.5 w-3.5 flex-shrink-0" />
          <span className="text-xs font-semibold uppercase tracking-wider">
            {language}
          </span>
        </button>

        {/* Theme toggle — hidden on mobile */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={theme === "light" ? t.switchToDark : t.switchToLight}
          className={cn(
            "hidden h-8 w-8 items-center justify-center rounded-xl sm:flex",
            "text-muted-foreground transition-all duration-150",
            "hover:bg-accent hover:text-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          )}
        >
          {theme === "light" ? (
            <Moon className="h-3.5 w-3.5" />
          ) : (
            <Sun className="h-3.5 w-3.5" />
          )}
        </button>

        <div className="h-4 w-px bg-border" />

        {/* Notification bell */}
        <button
          type="button"
          aria-label={t.notifications}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-xl",
            "text-muted-foreground transition-all duration-150",
            "hover:bg-accent hover:text-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          )}
        >
          <Bell className="h-4 w-4" />
        </button>

        <div className="h-4 w-px bg-border" />

        {/* Profile menu */}
        <UserMenu
          name={user?.name ?? ""}
          email={user?.email ?? ""}
          labels={userMenuLabels}
          onSignOut={signOut}
          onProfileSettings={() => navigate("/profile")}
          isSigningOut={isLoggingOut}
          disabled={isLoggingOut}
        />
      </div>
    </header>
  );
}

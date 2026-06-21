import type { JSX } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Layers, RefreshCw, Pill, ChevronLeft, ChevronRight, Languages, Moon, Sun } from "lucide-react";

import { cn } from "@/utils/cn";
import { useLanguage } from "@/hooks/useLanguage";
import { useTheme } from "@/hooks/useTheme";
import { toggleSidebar, setMobileSidebarOpen } from "@/store/uiSlice";
import { clearPharmacy } from "@/store/authSlice";
import { GLOBAL_NAV_GROUPS, PHARMACY_NAV_GROUPS, PHARMACY_STAFF_PRE_SELECT_NAV_GROUPS } from "@/configs/navigation";
import type { RootState, AppDispatch } from "@/store";

export function Sidebar(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const collapsed = useSelector((state: RootState) => state.ui.sidebarCollapsed);
  const mobileSidebarOpen = useSelector(
    (state: RootState) => state.ui.mobileSidebarOpen
  );
  const pharmacySelected = useSelector(
    (state: RootState) => state.auth.pharmacySelected
  );
  const currentPharmacy = useSelector(
    (state: RootState) => state.auth.currentPharmacy
  );
  const user = useSelector((state: RootState) => state.auth.user);
  const pharmacyCount = user?.accessiblePharmacies.length ?? 0;
  const isPlatformUser = user !== null && user?.platformRole !== null;
  const isOwner = user?.accessiblePharmacies.some((p) => p.role?.type === "OWNER") ?? false;
  const canSwitchPharmacy = isPlatformUser || isOwner || pharmacyCount > 1;
  const { t, language, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const branchLabel = pharmacyCount === 1 ? t.branchSingular : t.branchPlural;

  const closeMobile = () => dispatch(setMobileSidebarOpen(false));

  return (
    <aside
      className={cn(
        // Mobile: fixed full-height overlay, always w-60
        "fixed inset-y-0 left-0 z-50 flex h-screen w-60 flex-col border-r border-border bg-card",
        // Desktop: back to normal flow, width driven by collapsed state
        "md:relative md:inset-auto md:z-auto md:flex-shrink-0",
        collapsed ? "md:w-16" : "md:w-60",
        // Slide animation — mobile hides off-left, desktop always visible
        "transition-all duration-200 ease-in-out",
        mobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          "flex h-16 flex-shrink-0 items-center gap-2.5 border-b border-border px-4",
          collapsed && "md:justify-center md:px-0"
        )}
      >
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-start to-brand-end shadow-sm">
          <Pill className="h-4 w-4 text-white" />
        </div>
        <span
          className={cn(
            "truncate text-sm font-bold text-foreground",
            collapsed && "md:hidden"
          )}
        >
          {t.appName}
        </span>
      </div>

      {/* Workspace card */}
      <div className="px-2 pb-1 pt-3">
        <div
          className={cn(
            "flex items-center gap-2.5 rounded-xl border border-border bg-background p-2.5",
            "transition-all duration-150",
            collapsed && "md:justify-center md:p-2"
          )}
        >
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary/15">
            <Layers className="h-4 w-4 text-primary" />
          </div>

          <div className={cn("min-w-0 flex-1", collapsed && "md:hidden")}>
            <p className="truncate text-sm font-semibold text-foreground">
              {currentPharmacy?.name ?? t.appName}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {pharmacyCount} {branchLabel}
            </p>
          </div>

          {canSwitchPharmacy && (
            <button
              type="button"
              onClick={() => {
                sessionStorage.setItem("switching_pharmacy", "true");
                navigate("/");
                dispatch(clearPharmacy());
                closeMobile();
              }}
              aria-label={t.switchPharmacy}
              title={t.switchPharmacy}
              className={cn(
                "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg",
                "text-muted-foreground transition-all duration-150",
                "hover:bg-primary/10 hover:text-primary",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                collapsed && "md:hidden"
              )}
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Nav groups */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-2">
        {(pharmacySelected ? PHARMACY_NAV_GROUPS : isPlatformUser ? GLOBAL_NAV_GROUPS : PHARMACY_STAFF_PRE_SELECT_NAV_GROUPS).map((group, gi) => (
          <div
            key={gi}
            className={cn("px-2", gi > 0 && "mt-1 border-t border-border pt-1")}
          >
            {group.items.map((item) => (
              <NavLink
                key={item.key}
                to={item.path}
                end={item.end}
                title={collapsed ? t[item.labelKey] : undefined}
                onClick={closeMobile}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium",
                    "transition-all duration-150",
                    collapsed && "md:justify-center md:px-0 md:py-2.5",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      className={cn(
                        "h-4 w-4 flex-shrink-0",
                        isActive ? "text-primary" : "text-muted-foreground"
                      )}
                    />
                    <span className={cn("truncate", collapsed && "md:hidden")}>
                      {t[item.labelKey]}
                    </span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Theme + Language — mobile only */}
      <div className="border-t border-border p-2 md:hidden">
        <button
          type="button"
          onClick={toggleLanguage}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-all duration-150 hover:bg-accent hover:text-foreground"
        >
          <Languages className="h-4 w-4 flex-shrink-0" />
          <span className="truncate uppercase tracking-wider text-xs">{language}</span>
        </button>
        <button
          type="button"
          onClick={toggleTheme}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-all duration-150 hover:bg-accent hover:text-foreground"
        >
          {theme === "light" ? (
            <Moon className="h-4 w-4 flex-shrink-0" />
          ) : (
            <Sun className="h-4 w-4 flex-shrink-0" />
          )}
          <span className="truncate">{theme === "light" ? t.switchToDark : t.switchToLight}</span>
        </button>
      </div>

      {/* Collapse toggle — desktop only */}
      <div className="hidden border-t border-border p-2 md:block">
        <button
          type="button"
          onClick={() => dispatch(toggleSidebar())}
          aria-label={collapsed ? t.sidebarExpand : t.sidebarCollapse}
          className={cn(
            "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium",
            "text-muted-foreground transition-all duration-150",
            "hover:bg-accent hover:text-foreground",
            collapsed && "justify-center px-0"
          )}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4 flex-shrink-0" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{t.sidebarCollapse}</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}

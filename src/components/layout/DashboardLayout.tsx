import type { JSX } from "react";
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { useLanguage } from "@/hooks/useLanguage";
import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { NAV_GROUPS } from "@/configs/navigation";
import { setMobileSidebarOpen } from "@/store/uiSlice";
import type { Translations } from "@/configs/i18n";
import type { RootState, AppDispatch } from "@/store";

function resolvePageTitle(pathname: string, t: Translations): string {
  for (const group of NAV_GROUPS) {
    const match = group.items.find((item) =>
      item.end ? pathname === item.path : pathname.startsWith(item.path)
    );
    if (match) return t[match.labelKey];
  }
  return t.navDashboard;
}

export function DashboardLayout(): JSX.Element {
  const { t } = useLanguage();
  const { pathname } = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const mobileSidebarOpen = useSelector(
    (state: RootState) => state.ui.mobileSidebarOpen
  );

  const pageTitle = resolvePageTitle(pathname, t);

  useEffect(() => {
    document.title = `${pageTitle} — ${t.appName}`;
  }, [pageTitle, t.appName]);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Backdrop — closes sidebar when tapped on mobile */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm md:hidden"
          onClick={() => dispatch(setMobileSidebarOpen(false))}
        />
      )}

      <Sidebar />

      <div className="flex flex-1 flex-col overflow-y-auto">
        <DashboardHeader pageTitle={pageTitle} />

        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

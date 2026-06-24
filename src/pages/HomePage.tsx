import { useMemo, useRef, useState, useEffect } from "react";
import type { JSX } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  Menu,
  Moon,
  Sun,
  Languages,
  Hospital,
  BarChart2,
  Search,
  Bell,
} from "lucide-react";

import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import { PharmacyCard } from "@/components/pharmacy/PharmacyCard";
import {
  PharmacyFilterTabs,
  type FilterTab,
  type PharmacyFilter,
} from "@/components/pharmacy/PharmacyFilterTabs";
import { UserMenu } from "@/components/shared/UserMenu";
import { Sidebar } from "@/components/layout/Sidebar";

import { useSelectPharmacy } from "@/hooks/useSelectPharmacy";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";
import { getGreetingKey } from "@/utils/greeting";
import { toggleMobileSidebar, setMobileSidebarOpen } from "@/store/uiSlice";
import type { RootState, AppDispatch } from "@/store";

export default function HomePage(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const { theme, toggleTheme } = useTheme();
  const { language, t, toggleLanguage } = useLanguage();
  const { select, signOut, selectingUuid, isSelecting, isLoggingOut } =
    useSelectPharmacy();

  const user = useSelector((state: RootState) => state.auth.user);
  const pharmacySelected = useSelector((state: RootState) => state.auth.pharmacySelected);
  const accessiblePharmacies = useSelector(
    (state: RootState) => state.auth.user?.accessiblePharmacies
  );
  const mobileSidebarOpen = useSelector(
    (state: RootState) => state.ui.mobileSidebarOpen
  );
  const pharmacies = useMemo(() => accessiblePharmacies ?? [], [accessiblePharmacies]);

  const [activeFilter, setActiveFilter] = useState<PharmacyFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [redirectReason, setRedirectReason] = useState<string | null>(null);

  useEffect(() => {
    document.title = `${t.selectPharmacyTitle} — ${t.appName}`;
  }, [t.selectPharmacyTitle, t.appName]);

  useEffect(() => {
    const isPlatformUser = user !== null && user.platformRole !== null;
    const isOwner = pharmacies.length === 1 && pharmacies[0].role?.type === "OWNER";
    if (!isPlatformUser && !isOwner && !pharmacySelected && pharmacies.length === 1 && !isSelecting) {
      select(pharmacies[0].uuid);
    }
  }, [user, pharmacySelected, pharmacies, isSelecting, select]);

  useEffect(() => {
    const reason = sessionStorage.getItem("auth_redirect_reason");
    if (!reason) return;
    sessionStorage.removeItem("auth_redirect_reason");
    setRedirectReason(reason);
  }, []);

  useEffect(() => {
    if (redirectReason === "pharmacy_context_lost") {
      toast.warning(t.pharmacyContextLostTitle, { id: "auth-redirect", description: t.pharmacyContextLostDesc });
    }
  }, [redirectReason, t]);

  const searchRef = useRef<HTMLInputElement>(null);

  const greeting = t[getGreetingKey(new Date().getHours())];
  const pharmacyCount = pharmacies.length;

  const filteredPharmacies = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return pharmacies;
    return pharmacies.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q)
    );
  }, [pharmacies, searchQuery]);

  const filterTabs: FilterTab[] = useMemo(
    () => [
      { key: "all", label: t.filterAll, count: pharmacyCount, className: "w-[7.5rem] shrink-0" },
      { key: "open", label: t.filterOpen, count: pharmacyCount, className: "w-[7.5rem] shrink-0" },
      { key: "attention", label: t.filterNeedsAttention, count: 0, className: "w-[11.5rem] shrink-0" },
    ],
    [t, pharmacyCount]
  );

  const cardLabels = useMemo(
    () => ({
      salesLabel: t.salesLabel,
      transactionsLabel: t.transactionsLabel,
      rxQueueLabel: t.rxQueueLabel,
      statusOpen: t.statusOpen,
      statusClosed: t.statusClosed,
      lowStockWarning: t.lowStockWarning,
      noHeadPharmacist: t.pharmaNoHeadPharmacist,
      noHeadPharmacistHint: t.pharmaNoHeadPharmacistHint,
    }),
    [t]
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
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm md:hidden"
          onClick={() => dispatch(setMobileSidebarOpen(false))}
        />
      )}

      <Sidebar />

      <div className="flex flex-1 flex-col overflow-y-auto">
        {/* ── Top bar ──────────────────────────────────────────────── */}
        <header className="sticky top-0 z-20 flex h-14 flex-shrink-0 items-center justify-between border-b border-border/50 bg-background/80 px-4 backdrop-blur-sm md:px-6">
          {/* Hamburger — mobile only */}
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

          {/* Right: controls */}
          <div className="ml-auto flex items-center gap-2">
            {/* Search — pharmacy filter */}
            <div
              className={cn(
                "flex items-center gap-2 rounded-xl border bg-background px-3 py-1.5",
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="w-40 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
              />
            </div>

            <div className="hidden h-4 w-px bg-border sm:block" />

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
              <Bell className="h-3.5 w-3.5" />
            </button>

            <div className="h-4 w-px bg-border" />

            <UserMenu
              name={user?.name ?? ""}
              email={user?.email ?? ""}
              labels={userMenuLabels}
              onSignOut={signOut}
              isSigningOut={isLoggingOut}
              disabled={isLoggingOut || isSelecting}
            />
          </div>
        </header>

        {/* ── Page content ─────────────────────────────────────────── */}
        <main className="mx-auto w-full max-w-5xl px-6 py-8">
          {/* Greeting + daily summary button */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground xl:text-4xl">
                {greeting},{" "}
                <em className="font-display font-normal italic text-primary">
                  {user?.name ?? ""}
                </em>
              </h1>
              <p className="mt-1.5 text-sm text-muted-foreground">
                <span>{t.pharmacyAccessPrefix} </span>
                <strong className="text-foreground">{pharmacyCount}</strong>
                <span>
                  {" "}
                  {pharmacyCount === 1 ? t.pharmacySingular : t.pharmacyPlural}
                </span>
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="mt-1 hidden min-w-[10.5rem] shrink-0 justify-center gap-2 rounded-xl sm:flex"
            >
              <BarChart2 className="h-4 w-4" />
              {t.dailySummary}
            </Button>
          </div>

          {/* ── Pharmacy section ──────────────────────────────────── */}
          <section className="mt-10">
            {/* Section header + filter tabs */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold tracking-widest text-muted-foreground">
                  {t.yourPharmacies}
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {t.selectBranchSubtitle}
                </p>
              </div>

              {pharmacies.length > 0 && (
                <PharmacyFilterTabs
                  active={activeFilter}
                  tabs={filterTabs}
                  onChange={setActiveFilter}
                />
              )}
            </div>

            {/* Empty state */}
            {pharmacies.length === 0 ? (
              <div className="mt-6 flex flex-col items-center gap-4 rounded-2xl border border-border bg-card px-8 py-14 text-center shadow-sm">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
                  <Hospital className="h-7 w-7 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {t.noPharmaciesTitle}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t.noPharmaciesDesc}
                  </p>
                </div>
              </div>
            ) : filteredPharmacies.length === 0 ? (
              <div className="mt-6 flex flex-col items-center gap-4 rounded-2xl border border-border bg-card px-8 py-10 text-center shadow-sm">
                <Search className="h-8 w-8 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">
                  No pharmacies match &ldquo;{searchQuery}&rdquo;
                </p>
              </div>
            ) : (
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {filteredPharmacies.map((pharmacy) => (
                  <PharmacyCard
                    key={pharmacy.uuid}
                    uuid={pharmacy.uuid}
                    name={pharmacy.name}
                    address={pharmacy.address}
                    labels={cardLabels}
                    onSelect={select}
                    isSelecting={isSelecting && selectingUuid === pharmacy.uuid}
                    disabled={isSelecting || isLoggingOut}
                  />
                ))}
              </div>
            )}
          </section>
        </main>

        {/* Footer */}
        <footer className="py-6 text-center text-xs text-muted-foreground/40">
          {t.copyright}
        </footer>
      </div>
    </div>
  );
}

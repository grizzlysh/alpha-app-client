import type { JSX } from "react";
import { cn } from "@/utils/cn";

export type PharmacyFilter = "all" | "open" | "attention";

export interface FilterTab {
  key: PharmacyFilter;
  label: string;
  count: number;
  className?: string;
}

interface PharmacyFilterTabsProps {
  active: PharmacyFilter;
  tabs: FilterTab[];
  onChange: (filter: PharmacyFilter) => void;
}

export function PharmacyFilterTabs({
  active,
  tabs,
  onChange,
}: PharmacyFilterTabsProps): JSX.Element {
  return (
    <div className="flex items-center gap-1.5 rounded-xl border border-border bg-card p-1 shadow-sm">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChange(tab.key)}
          className={cn(
            "flex items-center justify-center whitespace-nowrap rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all duration-150",
            tab.className,
            active === tab.key
              ? "bg-foreground text-background shadow-sm"
              : "text-muted-foreground hover:bg-accent hover:text-foreground"
          )}
        >
          {tab.label}
          <span
            className={cn(
              "ml-1.5 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1.5 text-xs font-semibold",
              active === tab.key
                ? "bg-background/20 text-background"
                : "bg-muted text-muted-foreground"
            )}
          >
            {tab.count}
          </span>
        </button>
      ))}
    </div>
  );
}

import type { JSX } from "react";
import { ShieldCheck } from "lucide-react";

import { cn } from "@/utils/cn";
import { Card } from "@/components/ui/card";
import type { Translations } from "@/configs/i18n";
import type { ComplianceResponse, LicenseItem } from "@/types/dashboard";
import { formatDate } from "@/utils/dateHelpers";

export interface DashboardComplianceProps {
  t: Translations;
  compliance: ComplianceResponse | null;
  isLoading: boolean;
}

function countdownClass(days: number): string {
  if (days < 0) return "bg-destructive/10 text-destructive";
  if (days <= 30) return "bg-destructive/10 text-destructive";
  if (days <= 90) return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300";
  return "bg-success/10 text-success";
}

interface LicenseRowProps {
  t: Translations;
  title: string;
  subtitle?: string;
  license: LicenseItem | null;
}

function LicenseRow({ t, title, subtitle, license }: LicenseRowProps): JSX.Element {
  if (!license) {
    return (
      <div className="flex items-center justify-between rounded-xl border border-border bg-muted/20 px-3 py-2.5">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">{title}</p>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
          {t.dashboardNotAvailableTitle}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-muted/20 px-3 py-2.5">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">
          {subtitle && <span>{subtitle} · </span>}
          {t.dashboardLicenseExpiresLabel} {formatDate(license.validUntil)}
        </p>
      </div>
      <span
        className={cn(
          "shrink-0 rounded-md px-2 py-1 text-xs font-medium",
          countdownClass(license.daysUntilExpiry)
        )}
      >
        {license.daysUntilExpiry < 0
          ? t.dashboardLicenseOverdue
          : `${license.daysUntilExpiry} ${t.dashboardDaysSuffix}`}
      </span>
    </div>
  );
}

export function DashboardCompliance({
  t,
  compliance,
  isLoading,
}: DashboardComplianceProps): JSX.Element {
  const businessLicenses = compliance?.businessLicenses ?? [];
  const practiceLicenses = compliance?.practiceLicenses ?? [];

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <ShieldCheck className="h-4 w-4 text-muted-foreground" />
        {t.dashboardComplianceTitle}
      </div>

      <div className="mt-3 space-y-2">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded-xl bg-muted/50" />
          ))
        ) : (
          <>
            {/* SIPNAP — not returned by API yet */}
            <div className="flex items-center justify-between rounded-xl border border-border bg-muted/20 px-3 py-2.5">
              <p className="text-sm font-medium text-foreground">{t.dashboardSipnapLabel}</p>
              <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                {t.dashboardNotAvailableTitle}
              </span>
            </div>

            {/* Business Licenses (SIA) */}
            {businessLicenses.length > 0
              ? businessLicenses.map((lic) => (
                  <LicenseRow key={lic.uuid} t={t} title={t.dashboardSiaLabel} license={lic} />
                ))
              : <LicenseRow t={t} title={t.dashboardSiaLabel} license={null} />}

            {/* Practice Licenses (APJ / pharmacists) — show all with name + role */}
            {practiceLicenses.length > 0
              ? practiceLicenses.map((pl) => (
                  <LicenseRow
                    key={pl.license.uuid}
                    t={t}
                    title={t.dashboardApjLabel}
                    subtitle={`${pl.userName} · ${pl.roleType}`}
                    license={pl.license}
                  />
                ))
              : <LicenseRow t={t} title={t.dashboardApjLabel} license={null} />}
          </>
        )}
      </div>
    </Card>
  );
}

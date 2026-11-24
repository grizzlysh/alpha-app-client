import type { JSX } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Info } from "lucide-react";

import { Card } from "@/components/ui/card";
import { ShiftDetailSheet } from "@/components/shifts/ShiftDetailSheet";
import { ShiftSettingsCard } from "@/components/shifts/ShiftSettingsCard";
import { ShiftTable } from "@/components/shifts/ShiftTable";
import { useCurrentShift } from "@/hooks/useCurrentShift";
import { useLanguage } from "@/hooks/useLanguage";
import { useCan } from "@/hooks/usePermission";
import { useScrollAwareTitle } from "@/hooks/useScrollAwareTitle";
import { useTablePageState } from "@/hooks/useTablePageState";
import { getShifts } from "@/service/shiftService";
import type { RootState } from "@/store";
import type { ShiftStatus } from "@/types/shift";
import { cn } from "@/utils/cn";

const STATUS_FILTERS: (ShiftStatus | undefined)[] = [undefined, "OPEN", "CLOSED"];

export default function ShiftsPage(): JSX.Element {
  const { t } = useLanguage();
  const can = useCan();
  const pageTitleRef = useScrollAwareTitle();
  const pharmacyUuid = useSelector((state: RootState) => state.auth.currentPharmacy?.uuid);
  const { page, setPage, limit, handleLimitChange } = useTablePageState();
  const [status, setStatus] = useState<ShiftStatus | undefined>(undefined);
  const [selected, setSelected] = useState<string | null>(null);
  const { data: current } = useCurrentShift();
  const canManage = can("shifts.manage");

  const { data, isLoading } = useQuery({
    queryKey: ["shifts", pharmacyUuid, page, limit, status],
    queryFn: () => getShifts({ page, limit, status }),
    placeholderData: keepPreviousData,
  });

  const statusLabel = (s: ShiftStatus | undefined): string =>
    s === "OPEN" ? t.shiftStatusOpen : s === "CLOSED" ? t.shiftStatusClosed : t.shiftFilterAll;

  return (
    <div className="space-y-6">
      <div>
        <h2 ref={pageTitleRef} className="text-2xl font-bold tracking-tight text-foreground">{t.navShifts}</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">{t.shiftSubtitle}</p>
      </div>

      {can("business_parameters.update") && <ShiftSettingsCard />}

      {current && !current.settings.enabled && (
        <p className="flex items-center gap-2 rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
          <Info className="h-4 w-4 flex-shrink-0" aria-hidden />
          {t.shiftDisabledInfo}
        </p>
      )}

      <Card className="overflow-hidden">
        <div className="flex flex-wrap gap-1 border-b border-border p-3" role="tablist" aria-label={t.navShifts}>
          {STATUS_FILTERS.map((s) => (
            <button
              key={s ?? "all"}
              type="button"
              role="tab"
              aria-selected={status === s}
              onClick={() => {
                setStatus(s);
                setPage(1);
              }}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                status === s ? "bg-primary/10 text-foreground" : "text-muted-foreground hover:bg-muted"
              )}
            >
              {statusLabel(s)}
            </button>
          ))}
        </div>
        <ShiftTable
          t={t}
          shifts={data?.data ?? []}
          isLoading={isLoading}
          page={page}
          limit={limit}
          total={data?.meta?.total ?? 0}
          totalPages={data?.meta?.totalPages ?? 1}
          onPageChange={setPage}
          onLimitChange={handleLimitChange}
          onOpen={(s) => setSelected(s.uuid)}
        />
      </Card>

      {selected && (
        <ShiftDetailSheet
          shiftUuid={selected}
          canClose={canManage}
          tolerance={current?.settings.differenceTolerance ?? 0}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}

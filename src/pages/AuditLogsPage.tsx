import type { JSX } from "react";
import { Fragment, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ChevronDown, ScrollText } from "lucide-react";

import { Card } from "@/components/ui/card";
import { AuditLogDetails } from "@/components/audit-logs/AuditLogDetails";
import { auditActionLabel, auditModuleLabel } from "@/components/audit-logs/auditLabels";
import { SearchInput } from "@/components/shared/SearchInput";
import { TableEmptyState } from "@/components/shared/TableEmptyState";
import { TableLoadingSkeleton } from "@/components/shared/TableLoadingSkeleton";
import { TablePaginationFooter } from "@/components/shared/TablePaginationFooter";
import { useLanguage } from "@/hooks/useLanguage";
import { useScrollAwareTitle } from "@/hooks/useScrollAwareTitle";
import { useTablePageState } from "@/hooks/useTablePageState";
import { getAuditActions, getAuditLogs } from "@/service/auditLogService";
import type { RootState } from "@/store";
import { cn } from "@/utils/cn";

const TH = "whitespace-nowrap bg-muted px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground";
const FIELD = "rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary";

const dateTime = (iso: string): string =>
  new Date(iso).toLocaleString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

export default function AuditLogsPage(): JSX.Element {
  const { t } = useLanguage();
  const pageTitleRef = useScrollAwareTitle();
  const pharmacyUuid = useSelector((state: RootState) => state.auth.currentPharmacy?.uuid);
  const { searchInput, debouncedSearch, handleSearchChange, page, setPage, limit, handleLimitChange } = useTablePageState();
  const [action, setAction] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const { data: actions } = useQuery({
    queryKey: ["audit-actions", pharmacyUuid],
    queryFn: getAuditActions,
    select: (res) => res.data ?? [],
  });
  // Filter by module, with the single actions grouped under it.
  const groups = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const a of actions ?? []) {
      const mod = a.action.split(".")[0];
      map.set(mod, [...(map.get(mod) ?? []), a.action]);
    }
    return [...map.entries()];
  }, [actions]);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["audit-logs", pharmacyUuid, page, limit, action, debouncedSearch, dateFrom, dateTo],
    queryFn: () =>
      getAuditLogs({
        page,
        limit,
        action: action || undefined,
        search: debouncedSearch || undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      }),
    placeholderData: keepPreviousData,
  });
  const logs = data?.data ?? [];

  const resetPage = (): void => setPage(1);

  return (
    <div className="space-y-6">
      <div>
        <h2 ref={pageTitleRef} className="text-2xl font-bold tracking-tight text-foreground">{t.navAuditLogs}</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">{t.auditSubtitle}</p>
      </div>

      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-end gap-3 border-b border-border p-3">
          <SearchInput value={searchInput} onChange={handleSearchChange} placeholder={t.auditSearchPlaceholder} isFetching={isFetching && !isLoading} />
          <select
            aria-label={t.auditAction}
            value={action}
            onChange={(e) => { setAction(e.target.value); resetPage(); }}
            className={cn(FIELD, "min-w-[12rem]")}
          >
            <option value="">{t.auditAllActions}</option>
            {groups.map(([mod, list]) => (
              <optgroup key={mod} label={auditModuleLabel(mod, t)}>
                <option value={mod}>{auditModuleLabel(mod, t)} — {t.auditAllActions.toLowerCase()}</option>
                {list.map((a) => <option key={a} value={a}>{auditActionLabel(a, t)}</option>)}
              </optgroup>
            ))}
          </select>
          <label className="flex flex-col gap-1 text-xs text-muted-foreground">
            {t.auditDateFrom}
            <input type="date" value={dateFrom} max={dateTo || undefined} onChange={(e) => { setDateFrom(e.target.value); resetPage(); }} className={FIELD} />
          </label>
          <label className="flex flex-col gap-1 text-xs text-muted-foreground">
            {t.auditDateTo}
            <input type="date" value={dateTo} min={dateFrom || undefined} onChange={(e) => { setDateTo(e.target.value); resetPage(); }} className={FIELD} />
          </label>
        </div>

        {isLoading ? (
          <TableLoadingSkeleton />
        ) : logs.length === 0 ? (
          <TableEmptyState
            isSearch={!!debouncedSearch}
            icon={<ScrollText className="h-8 w-8 text-muted-foreground/40" />}
            title={t.auditEmpty}
            description={t.auditEmptyDesc}
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className={TH}>{t.auditTime}</th>
                    <th className={TH}>{t.auditAction}</th>
                    <th className={cn(TH, "hidden md:table-cell")}>{t.auditRecord}</th>
                    <th className={cn(TH, "hidden sm:table-cell")}>{t.auditUser}</th>
                    <th className={cn(TH, "w-12")}><span className="sr-only">{t.auditDetails}</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {logs.map((log) => {
                    const open = expanded === log.uuid;
                    return (
                      <Fragment key={log.uuid}>
                        <tr className="align-top">
                          <td className="whitespace-nowrap px-5 py-3 text-muted-foreground">{dateTime(log.createdAt)}</td>
                          <td className="px-5 py-3">
                            <p className="font-medium text-foreground">{auditActionLabel(log.action, t)}</p>
                            <p className="text-xs text-muted-foreground md:hidden">{log.entityLabel}</p>
                            <p className="text-xs text-muted-foreground sm:hidden">{log.user?.name ?? t.auditSystem}</p>
                          </td>
                          <td className="hidden px-5 py-3 text-foreground md:table-cell">{log.entityLabel ?? "—"}</td>
                          <td className="hidden px-5 py-3 text-foreground sm:table-cell">{log.user?.name ?? t.auditSystem}</td>
                          <td className="px-3 py-2 text-right">
                            <button
                              type="button"
                              onClick={() => setExpanded(open ? null : log.uuid)}
                              aria-expanded={open}
                              aria-label={open ? t.auditHideDetails : t.auditShowDetails}
                              className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            >
                              <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
                            </button>
                          </td>
                        </tr>
                        {open && (
                          <tr className="bg-muted/30">
                            <td colSpan={5} className="px-5 py-3">
                              <AuditLogDetails log={log} t={t} />
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <TablePaginationFooter
              page={page}
              limit={limit}
              total={data?.meta?.total ?? 0}
              totalPages={data?.meta?.totalPages ?? 1}
              labels={t}
              onPageChange={setPage}
              onLimitChange={handleLimitChange}
            />
          </>
        )}
      </Card>
    </div>
  );
}

import type { JSX } from "react";
import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { SlidersHorizontal, MonitorCog } from "lucide-react";

import type { Translations } from "@/configs/i18n";
import type { Parameter } from "@/types/parameters";
import { TableSortIcon } from "@/components/shared/TableSortIcon";
import { TableEmptyState } from "@/components/shared/TableEmptyState";
import { TablePaginationFooter } from "@/components/shared/TablePaginationFooter";
import { ParameterRow } from "./ParameterRow";

// ── Loading skeleton ──────────────────────────────────────────────────────────

function LoadingRows(): JSX.Element {
  return (
    <div className="divide-y divide-border">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-4">
          <div className="flex-1 space-y-2">
            <div className="h-4 w-48 animate-pulse rounded bg-muted" />
            <div className="h-3 w-32 animate-pulse rounded bg-muted" />
          </div>
          <div className="ml-auto h-7 w-7 flex-shrink-0 animate-pulse rounded-lg bg-muted" />
        </div>
      ))}
    </div>
  );
}

// ── ParameterTable ────────────────────────────────────────────────────────────

export interface ParameterTableProps {
  parameters: Parameter[];
  isLoading: boolean;
  search: string;
  t: Translations;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onDetails: (p: Parameter) => void;
  onEdit: (p: Parameter) => void;
}

export function ParameterTable({
  parameters,
  isLoading,
  search,
  t,
  page,
  limit,
  total,
  totalPages,
  onPageChange,
  onLimitChange,
  onDetails,
  onEdit,
}: ParameterTableProps): JSX.Element {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo<ColumnDef<Parameter>[]>(
    () => [
      { accessorKey: "key", header: t.paramKey, enableSorting: true },
      { accessorKey: "value", header: t.paramValue, enableSorting: true },
      { accessorKey: "description", header: t.paramDescription, enableSorting: false },
      { accessorKey: "updatedAt", header: t.paramUpdated, enableSorting: true },
      { id: "actions", enableSorting: false },
    ],
    [t]
  );

  const table = useReactTable({
    data: parameters,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
  });

  if (isLoading) return <LoadingRows />;
  if (parameters.length === 0)
    return (
      <TableEmptyState
        isSearch={!!search}
        icon={<MonitorCog className="h-8 w-8 text-muted-foreground/40" />}
        title={search ? t.paramNoResults : t.paramEmptyTitle}
        description={t.paramEmptyDesc}
      />
    );

  const headerGroups = table.getHeaderGroups();
  const rows = table.getRowModel().rows;

  const colVisibility: Record<string, string> = {
    key: "",
    value: "",
    description: "hidden sm:table-cell",
    updatedAt: "hidden md:table-cell",
  };

  const colMinWidth: Record<string, string> = {
    key: "min-w-[220px]",
    value: "min-w-[180px]",
    description: "min-w-[200px]",
    updatedAt: "min-w-[140px]",
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-border">
                {headerGroup.headers.map((header, idx) => {
                  const isFirst = idx === 0;
                  const isLast = header.column.id === "actions";
                  const isSorted = header.column.getIsSorted();
                  const canSort = header.column.getCanSort();

                  if (isLast) {
                    return (
                      <th
                        key={header.id}
                        className="md:sticky md:right-0 z-10 w-14 border-l border-border/40 bg-muted px-3 py-3"
                      />
                    );
                  }

                  return (
                    <th
                      key={header.id}
                      className={[
                        isFirst
                          ? "md:sticky md:left-0 z-10 border-r border-border/40"
                          : (colVisibility[header.column.id] ?? ""),
                        colMinWidth[header.column.id] ?? "",
                        "bg-muted px-5 py-3 text-left",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      {canSort ? (
                        <button
                          type="button"
                          onClick={() => {
                            const current = header.column.getIsSorted();
                            if (current === false) header.column.toggleSorting(false);
                            else if (current === "asc") header.column.toggleSorting(true);
                            else header.column.clearSorting();
                          }}
                          className="group flex cursor-pointer items-center gap-1 whitespace-nowrap text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          <TableSortIcon isSorted={isSorted} />
                        </button>
                      ) : (
                        <span className="whitespace-nowrap text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </span>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((row) => (
              <ParameterRow
                key={row.original.uuid}
                parameter={row.original}
                t={t}
                onDetails={() => onDetails(row.original)}
                onEdit={() => onEdit(row.original)}
              />
            ))}
          </tbody>
        </table>
      </div>

      <TablePaginationFooter
        page={page}
        limit={limit}
        total={total}
        totalPages={totalPages}
        labels={t}
        onPageChange={onPageChange}
        onLimitChange={onLimitChange}
      />
    </>
  );
}

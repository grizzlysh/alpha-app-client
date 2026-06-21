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
import { Package } from "lucide-react";

import type { Translations } from "@/configs/i18n";
import type { Stock } from "@/types/stock";
import { TableSortIcon } from "@/components/shared/TableSortIcon";
import { TableLoadingSkeleton } from "@/components/shared/TableLoadingSkeleton";
import { TableEmptyState } from "@/components/shared/TableEmptyState";
import { TablePaginationFooter } from "@/components/shared/TablePaginationFooter";
import { StockRow } from "./StockRow";

// ── StockTable ────────────────────────────────────────────────────────────────

export interface StockTableProps {
  stocks: Stock[];
  isLoading: boolean;
  search: string;
  t: Translations;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onDetails: (s: Stock) => void;
  onSetPrice: (s: Stock) => void;
  onSetReorder: (s: Stock) => void;
}

export function StockTable({
  stocks,
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
  onSetPrice,
  onSetReorder,
}: StockTableProps): JSX.Element {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo<ColumnDef<Stock>[]>(
    () => [
      {
        id: "medicine",
        accessorFn: (row) => row.medicine.name,
        header: t.stockMedicineName,
        enableSorting: true,
      },
      {
        id: "totalPieces",
        accessorFn: (row) => row.totalPieces,
        header: t.stockTotalPieces,
        enableSorting: true,
      },
      {
        id: "type",
        accessorFn: (row) => row.medicine.type.name,
        header: t.medicineTypeLabel,
        enableSorting: true,
      },
      {
        id: "reorderLevel",
        accessorFn: (row) => row.reorderLevel,
        header: t.stockReorderLevel,
        enableSorting: true,
      },
      {
        id: "effectiveSellingPrice",
        accessorFn: (row) => row.effectiveSellingPrice,
        header: t.stockEffectivePrice,
        enableSorting: true,
      },
      {
        id: "updatedAt",
        accessorFn: (row) => row.updatedAt,
        header: t.stockUpdated,
        enableSorting: true,
      },
      { id: "actions", enableSorting: false },
    ],
    [t]
  );

  const table = useReactTable({
    data: stocks,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
  });

  if (isLoading) return <TableLoadingSkeleton />;
  if (stocks.length === 0)
    return (
      <TableEmptyState
        isSearch={!!search}
        icon={<Package className="h-8 w-8 text-muted-foreground/40" />}
        title={search ? t.stockNoResults : t.stockEmptyTitle}
        description={t.stockEmptyDesc}
      />
    );

  const headerGroups = table.getHeaderGroups();
  const rows = table.getRowModel().rows;

  const colVisibility: Record<string, string> = {
    medicine: "",
    totalPieces: "",
    type: "hidden md:table-cell",
    reorderLevel: "hidden sm:table-cell",
    effectiveSellingPrice: "hidden lg:table-cell",
    updatedAt: "hidden xl:table-cell",
  };

  const colMinWidth: Record<string, string> = {
    medicine: "min-w-[240px]",
    totalPieces: "min-w-[130px]",
    type: "min-w-[120px]",
    reorderLevel: "min-w-[110px]",
    effectiveSellingPrice: "min-w-[140px]",
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
              <StockRow
                key={row.original.uuid}
                stock={row.original}
                t={t}
                onDetails={() => onDetails(row.original)}
                onSetPrice={() => onSetPrice(row.original)}
                onSetReorder={() => onSetReorder(row.original)}
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

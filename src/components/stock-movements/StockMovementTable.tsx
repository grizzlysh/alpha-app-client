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
import { ArrowLeftRight } from "lucide-react";

import type { Translations } from "@/configs/i18n";
import type { StockMovement } from "@/types/stockMovement";
import { TableSortIcon } from "@/components/shared/TableSortIcon";
import { TableLoadingSkeleton } from "@/components/shared/TableLoadingSkeleton";
import { TableEmptyState } from "@/components/shared/TableEmptyState";
import { TablePaginationFooter } from "@/components/shared/TablePaginationFooter";
import { StockMovementRow } from "./StockMovementRow";

export interface StockMovementTableProps {
  movements: StockMovement[];
  isLoading: boolean;
  search?: string;
  t: Translations;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onDetails: (m: StockMovement) => void;
}

export function StockMovementTable({
  movements,
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
}: StockMovementTableProps): JSX.Element {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo<ColumnDef<StockMovement>[]>(
    () => [
      { accessorKey: "medicine", header: t.smMedicine, enableSorting: false },
      { accessorKey: "type", header: t.smType, enableSorting: false },
      { id: "reason", header: t.smReason, enableSorting: false },
      { id: "quantity", header: t.smQuantity, enableSorting: false },
      { id: "reference", header: t.smReference, enableSorting: false },
      { id: "createdAt", header: t.smDate, enableSorting: true },
      { id: "actions", enableSorting: false },
    ],
    [t]
  );

  const table = useReactTable({
    data: movements,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
  });

  if (isLoading) return <TableLoadingSkeleton />;
  if (movements.length === 0)
    return (
      <TableEmptyState
        isSearch={!!search}
        icon={<ArrowLeftRight className="h-8 w-8 text-muted-foreground/40" />}
        title={t.smEmptyTitle}
        description={t.smEmptyDesc}
      />
    );

  const headerGroups = table.getHeaderGroups();
  const rows = table.getRowModel().rows;

  const colVisibility: Record<string, string> = {
    medicine: "",
    type: "",
    reason: "hidden sm:table-cell",
    quantity: "hidden md:table-cell",
    reference: "hidden lg:table-cell",
    createdAt: "hidden sm:table-cell",
  };

  const colMinWidth: Record<string, string> = {
    medicine: "min-w-[240px]",
    type: "min-w-[110px]",
    reason: "min-w-[140px]",
    quantity: "min-w-[120px]",
    reference: "min-w-[140px]",
    createdAt: "min-w-[130px]",
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
              <StockMovementRow
                key={row.original.uuid}
                movement={row.original}
                t={t}
                onDetails={() => onDetails(row.original)}
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

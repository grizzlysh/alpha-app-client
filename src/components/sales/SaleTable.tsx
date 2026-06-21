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
import { Receipt } from "lucide-react";

import type { Translations } from "@/configs/i18n";
import type { Sale } from "@/types/sale";
import { TableSortIcon } from "@/components/shared/TableSortIcon";
import { TableLoadingSkeleton } from "@/components/shared/TableLoadingSkeleton";
import { TableEmptyState } from "@/components/shared/TableEmptyState";
import { TablePaginationFooter } from "@/components/shared/TablePaginationFooter";
import { SaleRow } from "./SaleRow";

export interface SaleTableProps {
  sales: Sale[];
  isLoading: boolean;
  search: string;
  t: Translations;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onDetails: (s: Sale) => void;
  onCancel: (s: Sale) => void;
  onRefund: (s: Sale) => void;
  onAddPayment: (s: Sale) => void;
  onComplete: (s: Sale) => void;
}

export function SaleTable({
  sales,
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
  onCancel,
  onRefund,
  onAddPayment,
  onComplete,
}: SaleTableProps): JSX.Element {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo<ColumnDef<Sale>[]>(
    () => [
      { accessorKey: "saleNumber", header: t.saleNumber, enableSorting: true },
      { accessorKey: "status", header: t.saleStatus, enableSorting: false },
      { id: "saleType", header: t.saleType, enableSorting: false },
      { id: "totalAmount", header: t.saleTotalAmount, enableSorting: true },
      { id: "paymentStatus", header: t.salePaymentStatusColumn, enableSorting: false },
      { id: "soldAt", header: t.saleSoldAt, enableSorting: true },
      { id: "actions", enableSorting: false },
    ],
    [t]
  );

  const table = useReactTable({
    data: sales,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
  });

  if (isLoading) return <TableLoadingSkeleton />;
  if (sales.length === 0)
    return (
      <TableEmptyState
        isSearch={!!search}
        icon={<Receipt className="h-8 w-8 text-muted-foreground/40" />}
        title={search ? t.saleNoResults : t.saleEmptyTitle}
        description={t.saleEmptyDesc}
      />
    );

  const headerGroups = table.getHeaderGroups();
  const rows = table.getRowModel().rows;

  const colVisibility: Record<string, string> = {
    saleNumber: "",
    status: "",
    saleType: "hidden sm:table-cell",
    totalAmount: "hidden md:table-cell",
    paymentStatus: "hidden md:table-cell",
    soldAt: "hidden lg:table-cell",
  };

  const colMinWidth: Record<string, string> = {
    saleNumber: "min-w-[220px]",
    status: "min-w-[120px]",
    saleType: "min-w-[100px]",
    totalAmount: "min-w-[120px]",
    paymentStatus: "min-w-[110px]",
    soldAt: "min-w-[140px]",
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
              <SaleRow
                key={row.original.uuid}
                sale={row.original}
                t={t}
                onDetails={() => onDetails(row.original)}
                onCancel={() => onCancel(row.original)}
                onRefund={() => onRefund(row.original)}
                onAddPayment={() => onAddPayment(row.original)}
                onComplete={() => onComplete(row.original)}
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

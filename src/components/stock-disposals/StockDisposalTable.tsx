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
import { ArchiveX } from "lucide-react";

import type { Translations } from "@/configs/i18n";
import type { StockDisposal } from "@/types/stockDisposal";
import { TableSortIcon } from "@/components/shared/TableSortIcon";
import { TableLoadingSkeleton } from "@/components/shared/TableLoadingSkeleton";
import { TableEmptyState } from "@/components/shared/TableEmptyState";
import { TablePaginationFooter } from "@/components/shared/TablePaginationFooter";
import { StockDisposalRow } from "./StockDisposalRow";

export interface StockDisposalTableProps {
  disposals: StockDisposal[];
  isLoading: boolean;
  search: string;
  t: Translations;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onAdd: () => void;
  onDetails: (d: StockDisposal) => void;
  onEdit: (d: StockDisposal) => void;
  onComplete: (d: StockDisposal) => void;
  onCancel: (d: StockDisposal) => void;
  onDelete: (d: StockDisposal) => void;
}

export function StockDisposalTable({
  disposals,
  isLoading,
  search,
  t,
  page,
  limit,
  total,
  totalPages,
  onPageChange,
  onLimitChange,
  onAdd,
  onDetails,
  onEdit,
  onComplete,
  onCancel,
  onDelete,
}: StockDisposalTableProps): JSX.Element {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo<ColumnDef<StockDisposal>[]>(
    () => [
      { accessorKey: "disposalNumber", header: t.sdDisposalNumber, enableSorting: true },
      { accessorKey: "status", header: t.sdStatus, enableSorting: false },
      { id: "itemCount", header: t.sdItemsSection, enableSorting: false },
      { id: "disposedAt", header: t.sdDisposedAt, enableSorting: true },
      { id: "signedBy", header: t.sdSignedBy, enableSorting: false },
      { id: "actions", enableSorting: false },
    ],
    [t]
  );

  const table = useReactTable({
    data: disposals,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
  });

  if (isLoading) return <TableLoadingSkeleton />;
  if (disposals.length === 0)
    return (
      <TableEmptyState
        isSearch={!!search}
        icon={<ArchiveX className="h-8 w-8 text-muted-foreground/40" />}
        title={search ? t.sdNoResults : t.sdEmptyTitle}
        description={t.sdEmptyDesc}
        addLabel={t.sdAdd}
        onAdd={onAdd}
      />
    );

  const headerGroups = table.getHeaderGroups();
  const rows = table.getRowModel().rows;

  const colVisibility: Record<string, string> = {
    disposalNumber: "",
    status: "",
    itemCount: "hidden sm:table-cell",
    disposedAt: "hidden md:table-cell",
    signedBy: "hidden lg:table-cell",
  };

  const colMinWidth: Record<string, string> = {
    disposalNumber: "min-w-[220px]",
    status: "min-w-[120px]",
    itemCount: "min-w-[90px]",
    disposedAt: "min-w-[140px]",
    signedBy: "min-w-[140px]",
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
              <StockDisposalRow
                key={row.original.uuid}
                disposal={row.original}
                t={t}
                onDetails={() => onDetails(row.original)}
                onEdit={() => onEdit(row.original)}
                onComplete={() => onComplete(row.original)}
                onCancel={() => onCancel(row.original)}
                onDelete={() => onDelete(row.original)}
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

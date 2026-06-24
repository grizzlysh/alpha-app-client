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
import { Box } from "lucide-react";

import type { Translations } from "@/configs/i18n";
import type { StorageBin } from "@/types/storage";
import { TableSortIcon } from "@/components/shared/TableSortIcon";
import { TableLoadingSkeleton } from "@/components/shared/TableLoadingSkeleton";
import { TableEmptyState } from "@/components/shared/TableEmptyState";
import { TablePaginationFooter } from "@/components/shared/TablePaginationFooter";
import { BinRow } from "./BinRow";

export interface BinTableProps {
  bins: StorageBin[];
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
  onEdit: (b: StorageBin) => void;
  onDelete: (b: StorageBin) => void;
}

export function BinTable({
  bins,
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
  onEdit,
  onDelete,
}: BinTableProps): JSX.Element {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo<ColumnDef<StorageBin>[]>(
    () => [
      { accessorKey: "name", header: t.binName, enableSorting: true },
      { accessorKey: "description", header: t.binDescription, enableSorting: false },
      { accessorKey: "status", header: t.binStatus, enableSorting: true },
      { id: "actions", enableSorting: false },
    ],
    [t]
  );

  const table = useReactTable({
    data: bins,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
  });

  if (isLoading) return <TableLoadingSkeleton />;
  if (bins.length === 0)
    return (
      <TableEmptyState
        isSearch={!!search}
        icon={<Box className="h-8 w-8 text-muted-foreground/40" />}
        title={search ? t.binNoResults : t.binEmptyTitle}
        description={t.binEmptyDesc}
        addLabel={t.binAdd}
        onAdd={onAdd}
      />
    );

  const headerGroups = table.getHeaderGroups();
  const rows = table.getRowModel().rows;

  const colVisibility: Record<string, string> = {
    name: "",
    description: "hidden md:table-cell",
    status: "",
  };

  const colMinWidth: Record<string, string> = {
    name: "min-w-[220px]",
    description: "min-w-[200px]",
    status: "min-w-[110px]",
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
              <BinRow
                key={row.original.uuid}
                bin={row.original}
                t={t}
                onEdit={() => onEdit(row.original)}
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

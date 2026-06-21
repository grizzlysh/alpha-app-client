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
import { Search, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { ReferenceItem, ReferenceLabels } from "./referenceTypes";
import { TableSortIcon } from "@/components/shared/TableSortIcon";
import { TablePaginationFooter } from "@/components/shared/TablePaginationFooter";
import { ReferenceRow } from "./ReferenceRow";

// ── Loading skeleton ──────────────────────────────────────────────────────────

function LoadingRows(): JSX.Element {
  return (
    <div className="divide-y divide-border">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-4">
          <div className="h-10 w-10 flex-shrink-0 animate-pulse rounded-xl bg-muted" />
          <div className="h-4 w-36 animate-pulse rounded bg-muted" />
          <div className="ml-4 hidden h-3.5 w-52 animate-pulse rounded bg-muted sm:block" />
          <div className="ml-auto h-7 w-7 flex-shrink-0 animate-pulse rounded-lg bg-muted" />
        </div>
      ))}
    </div>
  );
}

// ── Empty / no-results state ──────────────────────────────────────────────────

function EmptyState({
  isSearch,
  labels,
  onAdd,
}: {
  isSearch: boolean;
  labels: ReferenceLabels;
  onAdd: () => void;
}): JSX.Element {
  return (
    <div className="flex flex-col items-center gap-4 px-8 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
        <Search className="h-8 w-8 text-muted-foreground/40" />
      </div>
      <div>
        <p className="font-semibold text-foreground">
          {isSearch ? labels.noResults : labels.emptyTitle}
        </p>
        {!isSearch && (
          <p className="mt-1 text-sm text-muted-foreground">{labels.emptyDesc}</p>
        )}
      </div>
      {!isSearch && (
        <Button onClick={onAdd} className="gap-2 rounded-xl">
          <Plus className="h-4 w-4" />
          <span className="inline-block text-center" style={{ width: labels.addBtnWidth }}>{labels.addBtn}</span>
        </Button>
      )}
    </div>
  );
}

// ── ReferenceTable ────────────────────────────────────────────────────────────

export interface ReferenceTableProps {
  items: ReferenceItem[];
  isLoading: boolean;
  search: string;
  labels: ReferenceLabels;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onAdd: () => void;
  onDetails: (item: ReferenceItem) => void;
  onEdit: (item: ReferenceItem) => void;
  onDelete: (item: ReferenceItem) => void;
}

export function ReferenceTable({
  items,
  isLoading,
  search,
  labels,
  page,
  limit,
  total,
  totalPages,
  onPageChange,
  onLimitChange,
  onAdd,
  onDetails,
  onEdit,
  onDelete,
}: ReferenceTableProps): JSX.Element {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo<ColumnDef<ReferenceItem>[]>(
    () => [
      { accessorKey: "name", header: labels.nameColumn, enableSorting: true },
      { accessorKey: "status", header: labels.statusColumn, enableSorting: true },
      ...(labels.requiredPrescriptionLabel
        ? [{ accessorKey: "requiredPrescription", header: labels.requiredPrescriptionLabel, enableSorting: true } as ColumnDef<ReferenceItem>]
        : []),
      { id: "actions", enableSorting: false },
    ],
    [labels]
  );

  const table = useReactTable({
    data: items,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
  });

  if (isLoading) return <LoadingRows />;
  if (items.length === 0)
    return <EmptyState isSearch={!!search} labels={labels} onAdd={onAdd} />;

  const headerGroups = table.getHeaderGroups();
  const rows = table.getRowModel().rows;

  const colVisibility: Record<string, string> = {
    name: "",
    status: "hidden sm:table-cell",
    requiredPrescription: "hidden sm:table-cell",
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
                          ? "md:sticky md:left-0 z-10 min-w-[220px] border-r border-border/40"
                          : (colVisibility[header.column.id] ?? "") + " min-w-[280px]",
                        "bg-muted px-5 py-3 text-left",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      {canSort ? (
                        <button
                          type="button"
                          onClick={header.column.getToggleSortingHandler()}
                          className="group flex items-center gap-1 whitespace-nowrap text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
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
              <ReferenceRow
                key={row.original.uuid}
                item={row.original}
                labels={labels}
                onDetails={() => onDetails(row.original)}
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
        labels={labels}
        onPageChange={onPageChange}
        onLimitChange={onLimitChange}
      />
    </>
  );
}

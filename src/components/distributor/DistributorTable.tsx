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
import { Truck } from "lucide-react";

import type { Translations } from "@/configs/i18n";
import type { Distributor } from "@/types/distributor";
import { TableSortIcon } from "@/components/shared/TableSortIcon";
import { TableLoadingSkeleton } from "@/components/shared/TableLoadingSkeleton";
import { TableEmptyState } from "@/components/shared/TableEmptyState";
import { TablePaginationFooter } from "@/components/shared/TablePaginationFooter";
import { DistributorRow } from "./DistributorRow";

export type SortKey = "name" | "contactPerson" | "phone" | "email" | "permitNumber";

// ── DistributorTable ──────────────────────────────────────────────────────────

export interface DistributorTableProps {
  distributors: Distributor[];
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
  onDetails: (d: Distributor) => void;
  onEdit: (d: Distributor) => void;
  onDelete: (d: Distributor) => void;
}

export function DistributorTable({
  distributors,
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
  onDelete,
}: DistributorTableProps): JSX.Element {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo<ColumnDef<Distributor>[]>(
    () => [
      { accessorKey: "name", header: t.distributorName, enableSorting: true },
      { accessorKey: "contactPerson", header: t.distributorContactPerson, enableSorting: true },
      { accessorKey: "phone", header: t.distributorPhone, enableSorting: true },
      { accessorKey: "permitNumber", header: t.distributorPermitNumber, enableSorting: true },
      { accessorKey: "email", header: t.distributorEmail, enableSorting: true },
      { id: "actions", enableSorting: false },
    ],
    [t]
  );

  const table = useReactTable({
    data: distributors,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
  });

  if (isLoading) return <TableLoadingSkeleton />;
  if (distributors.length === 0)
    return (
      <TableEmptyState
        isSearch={!!search}
        icon={<Truck className="h-8 w-8 text-muted-foreground/40" />}
        title={search ? t.distributorNoResults : t.distributorEmptyTitle}
        description={t.distributorEmptyDesc}
        addLabel={t.distributorAdd}
        onAdd={onAdd}
      />
    );

  const headerGroups = table.getHeaderGroups();
  const rows = table.getRowModel().rows;

  const colVisibility: Record<string, string> = {
    name: "",
    contactPerson: "hidden md:table-cell",
    phone: "hidden sm:table-cell",
    permitNumber: "hidden lg:table-cell",
    email: "hidden xl:table-cell",
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
                          : colVisibility[header.column.id] ?? "",
                        "bg-muted px-5 py-3 text-left",
                        header.column.id === "contactPerson" ? "min-w-[160px]" : "",
                        header.column.id === "phone" ? "min-w-[150px]" : "",
                        header.column.id === "permitNumber" ? "min-w-[160px]" : "",
                        header.column.id === "email" ? "min-w-[200px]" : "",
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
              <DistributorRow
                key={row.original.uuid}
                distributor={row.original}
                t={t}
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
        labels={t}
        onPageChange={onPageChange}
        onLimitChange={onLimitChange}
      />
    </>
  );
}

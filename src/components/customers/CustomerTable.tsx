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
import { UserRound } from "lucide-react";

import type { Translations } from "@/configs/i18n";
import type { Customer } from "@/types/customer";
import { TableSortIcon } from "@/components/shared/TableSortIcon";
import { TableLoadingSkeleton } from "@/components/shared/TableLoadingSkeleton";
import { TableEmptyState } from "@/components/shared/TableEmptyState";
import { TablePaginationFooter } from "@/components/shared/TablePaginationFooter";
import { CustomerRow } from "./CustomerRow";

export interface CustomerTableProps {
  customers: Customer[];
  isLoading: boolean;
  search: string;
  t: Translations;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onAdd?: () => void;
  onDetails: (customer: Customer) => void;
  onEdit?: (customer: Customer) => void;
  onDelete?: (customer: Customer) => void;
}

export function CustomerTable({
  customers,
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
}: CustomerTableProps): JSX.Element {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo<ColumnDef<Customer>[]>(
    () => [
      { accessorKey: "name", header: t.patientName, enableSorting: true },
      { id: "phone", header: t.patientPhone, enableSorting: false },
      { id: "address", header: t.patientAddress, enableSorting: false },
      { id: "customerType", header: t.customerFilterType, enableSorting: false },
      { id: "status", header: t.customerFilterStatus, enableSorting: false },
      { id: "actions", enableSorting: false },
    ],
    [t]
  );

  const table = useReactTable({
    data: customers,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
  });

  if (isLoading) return <TableLoadingSkeleton />;
  if (customers.length === 0)
    return (
      <TableEmptyState
        isSearch={!!search}
        icon={<UserRound className="h-8 w-8 text-muted-foreground/40" />}
        title={search ? t.customerNoResults : t.customerEmptyTitle}
        description={t.customerEmptyDesc}
        addLabel={t.customerAdd}
        onAdd={onAdd}
      />
    );

  const headerGroups = table.getHeaderGroups();
  const rows = table.getRowModel().rows;

  const colVisibility: Record<string, string> = {
    name: "",
    phone: "hidden sm:table-cell",
    address: "hidden md:table-cell",
    customerType: "hidden lg:table-cell",
    status: "hidden xl:table-cell",
  };

  const colMinWidth: Record<string, string> = {
    name: "min-w-[160px] sm:min-w-[220px]",
    phone: "min-w-[150px]",
    address: "min-w-[200px]",
    customerType: "min-w-[130px]",
    status: "min-w-[100px]",
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
                        className="sticky right-0 z-10 w-14 border-l border-border/40 bg-muted px-3 py-3"
                      />
                    );
                  }

                  return (
                    <th
                      key={header.id}
                      className={[
                        isFirst
                          ? "sticky left-0 z-10 min-w-[160px] sm:min-w-[220px] border-r border-border/40"
                          : colVisibility[header.column.id] ?? "",
                        "bg-muted px-5 py-3 text-left",
                        colMinWidth[header.column.id] ?? "",
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
              <CustomerRow
                key={row.original.uuid}
                customer={row.original}
                t={t}
                onDetails={() => onDetails(row.original)}
                onEdit={onEdit ? () => onEdit(row.original) : undefined}
                onDelete={onDelete ? () => onDelete(row.original) : undefined}
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

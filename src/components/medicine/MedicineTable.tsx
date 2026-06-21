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
import { Pill } from "lucide-react";

import type { Translations } from "@/configs/i18n";
import type { Medicine } from "@/types/medicine";
import { TableSortIcon } from "@/components/shared/TableSortIcon";
import { TableLoadingSkeleton } from "@/components/shared/TableLoadingSkeleton";
import { TableEmptyState } from "@/components/shared/TableEmptyState";
import { TablePaginationFooter } from "@/components/shared/TablePaginationFooter";
import { MedicineRow } from "./MedicineRow";

// ── MedicineTable ─────────────────────────────────────────────────────────────

export interface MedicineTableProps {
  medicines: Medicine[];
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
  onDetails: (m: Medicine) => void;
  onEdit: (m: Medicine) => void;
  onDelete: (m: Medicine) => void;
}

export function MedicineTable({
  medicines,
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
}: MedicineTableProps): JSX.Element {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo<ColumnDef<Medicine>[]>(
    () => [
      { accessorKey: "name", header: t.medicineName, enableSorting: true },
      {
        id: "medicineShape",
        accessorFn: (row) => row.medicineShape?.name ?? "",
        header: t.medicineShapeLabel,
        enableSorting: true,
      },
      {
        id: "medicineType",
        accessorFn: (row) => row.medicineType?.name ?? "",
        header: t.medicineTypeLabel,
        enableSorting: true,
      },
      { accessorKey: "unit", header: t.medicineUnit, enableSorting: true },
      { accessorKey: "status", header: t.medicineStatusLabel, enableSorting: true },
      { id: "actions", enableSorting: false },
    ],
    [t]
  );

  const table = useReactTable({
    data: medicines,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
  });

  if (isLoading) return <TableLoadingSkeleton />;
  if (medicines.length === 0)
    return (
      <TableEmptyState
        isSearch={!!search}
        icon={<Pill className="h-8 w-8 text-muted-foreground/40" />}
        title={search ? t.medicineNoResults : t.medicineEmptyTitle}
        description={t.medicineEmptyDesc}
        addLabel={t.medicineAdd}
        onAdd={onAdd}
      />
    );

  const headerGroups = table.getHeaderGroups();
  const rows = table.getRowModel().rows;

  const colVisibility: Record<string, string> = {
    name: "",
    medicineShape: "hidden md:table-cell",
    medicineType: "hidden lg:table-cell",
    unit: "hidden sm:table-cell",
    status: "",
  };

  const colMinWidth: Record<string, string> = {
    name: "min-w-[220px]",
    medicineShape: "min-w-[120px]",
    medicineType: "min-w-[120px]",
    unit: "min-w-[80px]",
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
                          : colVisibility[header.column.id] ?? "",
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
              <MedicineRow
                key={row.original.uuid}
                medicine={row.original}
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

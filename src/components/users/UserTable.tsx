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
import { Users } from "lucide-react";

import type { Translations } from "@/configs/i18n";
import type { UserListItem } from "@/types/user";
import { TableSortIcon } from "@/components/shared/TableSortIcon";
import { TableLoadingSkeleton } from "@/components/shared/TableLoadingSkeleton";
import { TableEmptyState } from "@/components/shared/TableEmptyState";
import { TablePaginationFooter } from "@/components/shared/TablePaginationFooter";
import { UserRow } from "./UserRow";

// ── UserTable ─────────────────────────────────────────────────────────────────

export interface UserTableProps {
  users: UserListItem[];
  isLoading: boolean;
  search: string;
  t: Translations;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  onPageChange: (p: number) => void;
  onLimitChange: (l: number) => void;
  onAdd: () => void;
  onDetails: (u: UserListItem) => void;
  onEdit: (u: UserListItem) => void;
  onDelete: (u: UserListItem) => void;
  onResetPassword: (u: UserListItem) => void;
}

export function UserTable({
  users,
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
  onResetPassword,
}: UserTableProps): JSX.Element {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo<ColumnDef<UserListItem>[]>(
    () => [
      { id: "name", accessorKey: "name", header: t.userName, enableSorting: true },
      { id: "platformRole", accessorKey: "platformRole", header: t.userPlatformRole, enableSorting: false },
      { id: "status", accessorKey: "status", header: t.userStatus, enableSorting: false },
      { id: "placementCount", accessorKey: "placementCount", header: t.userPlacementCount, enableSorting: false },
      { id: "actions", enableSorting: false },
    ],
    [t]
  );

  const table = useReactTable({
    data: users,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
  });

  if (isLoading) return <TableLoadingSkeleton />;
  if (users.length === 0)
    return (
      <TableEmptyState
        isSearch={!!search}
        icon={<Users className="h-8 w-8 text-muted-foreground/40" />}
        title={search ? t.userNoResults : t.userEmptyTitle}
        description={t.userEmptyDesc}
        addLabel={t.userAdd}
        onAdd={onAdd}
      />
    );

  const headerGroups = table.getHeaderGroups();
  const rows = table.getRowModel().rows;

  const colVisibility: Record<string, string> = {
    name: "",
    platformRole: "hidden sm:table-cell",
    status: "",
    placementCount: "hidden lg:table-cell",
  };

  const colMinWidth: Record<string, string> = {
    name: "min-w-[220px]",
    platformRole: "min-w-[160px]",
    status: "min-w-[110px]",
    placementCount: "min-w-[130px]",
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
              <UserRow
                key={row.original.uuid}
                user={row.original}
                t={t}
                onDetails={() => onDetails(row.original)}
                onEdit={() => onEdit(row.original)}
                onDelete={() => onDelete(row.original)}
                onResetPassword={() => onResetPassword(row.original)}
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

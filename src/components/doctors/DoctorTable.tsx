import type { JSX } from "react";
import { useMemo, useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { Stethoscope, MoreVertical, Eye, Pencil, Trash2 } from "lucide-react";

import { toDoctorName } from "@/utils/stringHelpers";

import type { Translations } from "@/configs/i18n";
import type { Doctor } from "@/types/doctor";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TableSortIcon } from "@/components/shared/TableSortIcon";
import { TableLoadingSkeleton } from "@/components/shared/TableLoadingSkeleton";
import { TableEmptyState } from "@/components/shared/TableEmptyState";
import { TablePaginationFooter } from "@/components/shared/TablePaginationFooter";

// ── Row action menu ───────────────────────────────────────────────────────────

interface RowMenuProps {
  t: Translations;
  onDetails: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

function RowMenu({ t, onDetails, onEdit, onDelete }: RowMenuProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, right: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent): void {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        btnRef.current &&
        !btnRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent): void {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  function handleToggle(): void {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    setPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
    setOpen((v) => !v);
  }

  function pick(fn: () => void): void {
    setOpen(false);
    fn();
  }

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={handleToggle}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {open &&
        createPortal(
          <div
            ref={menuRef}
            style={{ position: "fixed", top: pos.top, right: pos.right }}
            className="z-[55] w-44 overflow-hidden rounded-xl border border-border bg-card py-1 shadow-xl"
          >
            <button
              type="button"
              onClick={() => pick(onDetails)}
              className="flex w-full items-center gap-3 px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-accent"
            >
              <Eye className="h-4 w-4 text-muted-foreground" />
              {t.doctorDetails}
            </button>
            {onEdit && (
            <button
              type="button"
              onClick={() => pick(onEdit)}
              className="flex w-full items-center gap-3 px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-accent"
            >
              <Pencil className="h-4 w-4 text-muted-foreground" />
              {t.doctorEdit}
            </button>
            )}
            {onDelete && (
            <>
            <div className="mx-2 my-1 border-t border-border" />
            <button
              type="button"
              onClick={() => pick(onDelete)}
              className="flex w-full items-center gap-3 px-3 py-2.5 text-sm text-destructive transition-colors hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
              {t.doctorDelete}
            </button>
            </>
            )}
          </div>,
          document.body
        )}
    </>
  );
}

// ── Table row ─────────────────────────────────────────────────────────────────

interface DoctorRowProps {
  doctor: Doctor;
  t: Translations;
  onDetails: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

function DoctorRow({ doctor, t, onDetails, onEdit, onDelete }: DoctorRowProps): JSX.Element {
  return (
    <tr className="group transition-colors hover:bg-accent/40">
      {/* Sticky left: Name */}
      <td className="md:sticky md:left-0 z-[1] min-w-[220px] border-r border-border/40 bg-card px-5 py-4 transition-colors group-hover:bg-accent">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <Stethoscope className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium text-foreground">{toDoctorName(doctor.name)}</p>
            {doctor.specialty && (
              <p className="truncate text-xs text-muted-foreground">{doctor.specialty}</p>
            )}
          </div>
        </div>
      </td>

      {/* License — sm+ */}
      <td className="hidden min-w-[160px] px-5 py-4 sm:table-cell">
        {doctor.licenseNumber ? (
          <span className="text-sm text-foreground">{doctor.licenseNumber}</span>
        ) : (
          <span className="text-muted-foreground/40">—</span>
        )}
      </td>

      {/* Clinic — md+ */}
      <td className="hidden min-w-[200px] px-5 py-4 md:table-cell">
        {doctor.clinicName ? (
          <span className="max-w-[180px] truncate text-sm text-foreground block">{doctor.clinicName}</span>
        ) : (
          <span className="text-muted-foreground/40">—</span>
        )}
      </td>

      {/* Phone — lg+ */}
      <td className="hidden min-w-[150px] px-5 py-4 lg:table-cell">
        {doctor.phone ? (
          <span className="text-sm text-foreground">{doctor.phone}</span>
        ) : (
          <span className="text-muted-foreground/40">—</span>
        )}
      </td>

      {/* Status — xl+ */}
      <td className="hidden min-w-[110px] px-5 py-4 xl:table-cell">
        <StatusBadge
          status={doctor.status}
          label={doctor.status === "ACTIVE" ? t.doctorStatusActive : t.doctorStatusInactive}
        />
      </td>

      {/* Sticky right: actions */}
      <td className="md:sticky md:right-0 z-[1] w-14 border-l border-border/40 bg-card px-3 py-4 transition-colors group-hover:bg-accent">
        <RowMenu t={t} onDetails={onDetails} onEdit={onEdit} onDelete={onDelete} />
      </td>
    </tr>
  );
}

// ── DoctorTable ───────────────────────────────────────────────────────────────

export interface DoctorTableProps {
  doctors: Doctor[];
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
  onDetails: (doctor: Doctor) => void;
  onEdit?: (doctor: Doctor) => void;
  onDelete?: (doctor: Doctor) => void;
}

export function DoctorTable({
  doctors,
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
}: DoctorTableProps): JSX.Element {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo<ColumnDef<Doctor>[]>(
    () => [
      { accessorKey: "name", header: t.doctorName, enableSorting: true },
      { id: "licenseNumber", header: t.doctorLicenseNumber, enableSorting: false },
      { id: "clinicName", header: t.doctorClinicName, enableSorting: false },
      { id: "phone", header: t.doctorPhone, enableSorting: false },
      { id: "status", header: t.doctorStatusLabel, enableSorting: false },
      { id: "actions", enableSorting: false },
    ],
    [t]
  );

  const table = useReactTable({
    data: doctors,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
  });

  if (isLoading) return <TableLoadingSkeleton />;
  if (doctors.length === 0)
    return (
      <TableEmptyState
        isSearch={!!search}
        icon={<Stethoscope className="h-8 w-8 text-muted-foreground/40" />}
        title={search ? t.doctorNoResults : t.doctorEmptyTitle}
        description={t.doctorEmptyDesc}
        addLabel={t.doctorAdd}
        onAdd={onAdd}
      />
    );

  const headerGroups = table.getHeaderGroups();
  const rows = table.getRowModel().rows;

  const colVisibility: Record<string, string> = {
    name: "",
    licenseNumber: "hidden sm:table-cell",
    clinicName: "hidden md:table-cell",
    phone: "hidden lg:table-cell",
    status: "hidden xl:table-cell",
  };

  const colMinWidth: Record<string, string> = {
    name: "min-w-[220px]",
    licenseNumber: "min-w-[160px]",
    clinicName: "min-w-[200px]",
    phone: "min-w-[150px]",
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
                          ? "md:sticky md:left-0 z-10 min-w-[220px] border-r border-border/40"
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
              <DoctorRow
                key={row.original.uuid}
                doctor={row.original}
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

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
import { FileText, MoreVertical, Eye, Pencil, Trash2 } from "lucide-react";

import type { Translations } from "@/configs/i18n";
import type { PrescriptionListItem, PrescriptionStatus } from "@/types/prescription";
import { TableSortIcon } from "@/components/shared/TableSortIcon";
import { TableLoadingSkeleton } from "@/components/shared/TableLoadingSkeleton";
import { TableEmptyState } from "@/components/shared/TableEmptyState";
import { TablePaginationFooter } from "@/components/shared/TablePaginationFooter";
import { formatDate } from "@/utils/dateHelpers";
import { toDoctorName } from "@/utils/stringHelpers";

// ── Status badge ──────────────────────────────────────────────────────────────

function getPrescriptionStatusStyle(status: PrescriptionStatus): string {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300";
    case "DISPENSED":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300";
    case "PARTIAL":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
    case "CANCELLED":
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";
    case "EXPIRED":
      return "bg-muted text-muted-foreground";
  }
}

function getPrescriptionStatusLabel(status: PrescriptionStatus, t: Translations): string {
  switch (status) {
    case "PENDING":    return t.prescriptionStatusPending;
    case "DISPENSED":  return t.prescriptionStatusDispensed;
    case "PARTIAL":    return t.prescriptionStatusPartial;
    case "CANCELLED":  return t.prescriptionStatusCancelled;
    case "EXPIRED":    return t.prescriptionStatusExpired;
  }
}

export function PrescriptionStatusBadge({
  status,
  t,
}: {
  status: PrescriptionStatus;
  t: Translations;
}): JSX.Element {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getPrescriptionStatusStyle(status)}`}
    >
      {getPrescriptionStatusLabel(status, t)}
    </span>
  );
}

// ── Row action menu ───────────────────────────────────────────────────────────

interface RowMenuProps {
  t: Translations;
  status: PrescriptionStatus;
  onDetails: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

function RowMenu({ t, status, onDetails, onEdit, onDelete }: RowMenuProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, right: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const canEdit = status === "PENDING";

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
              {t.prescriptionDetails}
            </button>
            {canEdit && onEdit && (
              <button
                type="button"
                onClick={() => pick(onEdit)}
                className="flex w-full items-center gap-3 px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-accent"
              >
                <Pencil className="h-4 w-4 text-muted-foreground" />
                {t.prescriptionEdit}
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
              {t.prescriptionDelete}
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

interface PrescriptionRowProps {
  prescription: PrescriptionListItem;
  t: Translations;
  onDetails: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

function PrescriptionRow({
  prescription,
  t,
  onDetails,
  onEdit,
  onDelete,
}: PrescriptionRowProps): JSX.Element {
  return (
    <tr className="group transition-colors hover:bg-accent/40">
      {/* Sticky left: Patient */}
      <td className="md:sticky md:left-0 z-[1] min-w-[220px] border-r border-border/40 bg-card px-5 py-4 transition-colors group-hover:bg-accent">
        <div className="min-w-0">
          <p className="truncate font-medium uppercase text-foreground">{prescription.patient.name}</p>
          {prescription.prescriptionNumber && (
            <p className="truncate text-xs text-muted-foreground">
              {prescription.prescriptionNumber}
            </p>
          )}
        </div>
      </td>

      {/* Doctor — sm+ */}
      <td className="hidden min-w-[180px] px-5 py-4 sm:table-cell">
        {prescription.doctor ? (
          <span className="truncate text-sm text-foreground block max-w-[160px]">
            {toDoctorName(prescription.doctor.name)}
          </span>
        ) : (
          <span className="text-muted-foreground/40">—</span>
        )}
      </td>

      {/* Prescribed date — md+ */}
      <td className="hidden min-w-[140px] px-5 py-4 md:table-cell">
        <span className="text-sm text-foreground">
          {formatDate(prescription.prescribedAt)}
        </span>
      </td>

      {/* Status — lg+ */}
      <td className="hidden min-w-[120px] px-5 py-4 lg:table-cell">
        <PrescriptionStatusBadge status={prescription.status} t={t} />
      </td>

      {/* Sticky right: actions */}
      <td className="md:sticky md:right-0 z-[1] w-14 border-l border-border/40 bg-card px-3 py-4 transition-colors group-hover:bg-accent">
        <RowMenu
          t={t}
          status={prescription.status}
          onDetails={onDetails}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </td>
    </tr>
  );
}

// ── PrescriptionTable ─────────────────────────────────────────────────────────

export interface PrescriptionTableProps {
  prescriptions: PrescriptionListItem[];
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
  onDetails: (p: PrescriptionListItem) => void;
  onEdit?: (p: PrescriptionListItem) => void;
  onDelete?: (p: PrescriptionListItem) => void;
}

export function PrescriptionTable({
  prescriptions,
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
}: PrescriptionTableProps): JSX.Element {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo<ColumnDef<PrescriptionListItem>[]>(
    () => [
      { accessorFn: (row) => row.patient.name.toUpperCase(), id: "patient", header: t.prescriptionPatient, enableSorting: true },
      { accessorFn: (row) => row.doctor != null ? toDoctorName(row.doctor.name) : "", id: "doctor", header: t.prescriptionDoctor, enableSorting: false },
      { id: "prescribedAt", header: t.prescriptionPrescribedAt, enableSorting: false },
      { id: "status", header: t.prescriptionStatusLabel, enableSorting: false },
      { id: "actions", enableSorting: false },
    ],
    [t]
  );

  const table = useReactTable({
    data: prescriptions,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
  });

  if (isLoading) return <TableLoadingSkeleton />;
  if (prescriptions.length === 0)
    return (
      <TableEmptyState
        isSearch={!!search}
        icon={<FileText className="h-8 w-8 text-muted-foreground/40" />}
        title={search ? t.prescriptionNoResults : t.prescriptionEmptyTitle}
        description={t.prescriptionEmptyDesc}
        addLabel={t.prescriptionAdd}
        onAdd={onAdd}
      />
    );

  const headerGroups = table.getHeaderGroups();
  const rows = table.getRowModel().rows;

  const colVisibility: Record<string, string> = {
    patient: "",
    doctor: "hidden sm:table-cell",
    prescribedAt: "hidden md:table-cell",
    status: "hidden lg:table-cell",
  };

  const colMinWidth: Record<string, string> = {
    patient: "min-w-[220px]",
    doctor: "min-w-[180px]",
    prescribedAt: "min-w-[140px]",
    status: "min-w-[120px]",
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
              <PrescriptionRow
                key={row.original.uuid}
                prescription={row.original}
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

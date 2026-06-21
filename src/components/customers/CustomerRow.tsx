import type { JSX } from "react";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Phone, MapPin, MoreVertical, Eye, Pencil, Trash2 } from "lucide-react";

import { cn } from "@/utils/cn";
import type { Translations } from "@/configs/i18n";
import type { Customer } from "@/types/customer";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { getInitials, getAvatarColor } from "./customerUtils";

// ── Row action menu ───────────────────────────────────────────────────────────

interface RowMenuProps {
  t: Translations;
  isWalkIn: boolean;
  onDetails: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function RowMenu({ t, isWalkIn, onDetails, onEdit, onDelete }: RowMenuProps): JSX.Element {
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
              {t.customerDetails}
            </button>
            {!isWalkIn && (
              <>
                <button
                  type="button"
                  onClick={() => pick(onEdit)}
                  className="flex w-full items-center gap-3 px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-accent"
                >
                  <Pencil className="h-4 w-4 text-muted-foreground" />
                  {t.customerEdit}
                </button>
                <div className="mx-2 my-1 border-t border-border" />
                <button
                  type="button"
                  onClick={() => pick(onDelete)}
                  className="flex w-full items-center gap-3 px-3 py-2.5 text-sm text-destructive transition-colors hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                  {t.customerDelete}
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

export interface CustomerRowProps {
  customer: Customer;
  t: Translations;
  onDetails: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function CustomerRow({
  customer,
  t,
  onDetails,
  onEdit,
  onDelete,
}: CustomerRowProps): JSX.Element {
  return (
    <tr className="group transition-colors hover:bg-accent/40">
      {/* Sticky left: Name + avatar */}
      <td className="md:sticky md:left-0 z-[1] min-w-[220px] border-r border-border/40 bg-card px-5 py-4 transition-colors group-hover:bg-accent">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-sm font-bold",
              getAvatarColor(customer.name)
            )}
          >
            {getInitials(customer.name)}
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium uppercase text-foreground">{customer.name}</p>
            {customer.phone && (
              <p className="truncate text-xs text-muted-foreground sm:hidden">
                {customer.phone}
              </p>
            )}
          </div>
        </div>
      </td>

      {/* Phone — sm+ */}
      <td className="hidden min-w-[150px] px-5 py-4 sm:table-cell">
        {customer.phone ? (
          <div className="flex items-center gap-1.5 text-sm text-foreground">
            <Phone className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
            <span className="whitespace-nowrap">{customer.phone}</span>
          </div>
        ) : (
          <span className="text-muted-foreground/40">—</span>
        )}
      </td>

      {/* Address — md+ */}
      <td className="hidden min-w-[200px] px-5 py-4 md:table-cell">
        {customer.address ? (
          <div className="flex items-center gap-1.5 text-sm text-foreground">
            <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
            <span className="max-w-[180px] truncate">{customer.address}</span>
          </div>
        ) : (
          <span className="text-muted-foreground/40">—</span>
        )}
      </td>

      {/* Walk-in badge — lg+ */}
      <td className="hidden min-w-[110px] px-5 py-4 lg:table-cell">
        {customer.isWalkIn && (
          <span className="inline-block rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
            {t.customerWalkInBadge}
          </span>
        )}
      </td>

      {/* Status — xl+ */}
      <td className="hidden min-w-[100px] px-5 py-4 xl:table-cell">
        <StatusBadge
          status={customer.status}
          label={customer.status === "ACTIVE" ? t.customerStatusActive : t.customerStatusInactive}
        />
      </td>

      {/* Sticky right: Action menu */}
      <td className="md:sticky md:right-0 z-[1] w-14 border-l border-border/40 bg-card px-3 py-4 transition-colors group-hover:bg-accent">
        <RowMenu
          t={t}
          isWalkIn={customer.isWalkIn}
          onDetails={onDetails}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </td>
    </tr>
  );
}

import type { JSX } from "react";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Phone, Mail, Hash, MoreVertical, Eye, Pencil, Trash2 } from "lucide-react";

import { cn } from "@/utils/cn";
import type { Translations } from "@/configs/i18n";
import type { Distributor } from "@/types/distributor";
import { getInitials, getAvatarColor } from "./distributorUtils";

// ── Row action menu ───────────────────────────────────────────────────────────

interface RowMenuProps {
  t: Translations;
  onDetails: () => void;
  onEdit: () => void;
  onDelete: () => void;
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
              {t.distributorDetails}
            </button>
            <button
              type="button"
              onClick={() => pick(onEdit)}
              className="flex w-full items-center gap-3 px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-accent"
            >
              <Pencil className="h-4 w-4 text-muted-foreground" />
              {t.distributorEdit}
            </button>
            <div className="mx-2 my-1 border-t border-border" />
            <button
              type="button"
              onClick={() => pick(onDelete)}
              className="flex w-full items-center gap-3 px-3 py-2.5 text-sm text-destructive transition-colors hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
              {t.distributorDelete}
            </button>
          </div>,
          document.body
        )}
    </>
  );
}

// ── Table row ─────────────────────────────────────────────────────────────────

export interface DistributorRowProps {
  distributor: Distributor;
  t: Translations;
  onDetails: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function DistributorRow({
  distributor,
  t,
  onDetails,
  onEdit,
  onDelete,
}: DistributorRowProps): JSX.Element {
  return (
    <tr className="group transition-colors hover:bg-accent/40">
      {/* Sticky left: Name + avatar */}
      <td className="md:sticky md:left-0 z-[1] min-w-[220px] border-r border-border/40 bg-card px-5 py-4 transition-colors group-hover:bg-accent">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-sm font-bold",
              getAvatarColor(distributor.name)
            )}
          >
            {getInitials(distributor.name)}
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium uppercase text-foreground">
              {distributor.name}
            </p>
            {distributor.contactPerson && (
              <p className="truncate text-xs text-muted-foreground md:hidden">
                {distributor.contactPerson}
              </p>
            )}
          </div>
        </div>
      </td>

      {/* Contact person — md+ */}
      <td className="hidden min-w-[160px] px-5 py-4 md:table-cell">
        {distributor.contactPerson ? (
          <span className="text-sm text-foreground">
            {distributor.contactPerson}
          </span>
        ) : (
          <span className="text-muted-foreground/40">—</span>
        )}
      </td>

      {/* Phone — sm+ */}
      <td className="hidden min-w-[150px] px-5 py-4 sm:table-cell">
        <div className="flex items-center gap-1.5 text-sm text-foreground">
          <Phone className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
          <span className="whitespace-nowrap">{distributor.phone}</span>
        </div>
      </td>

      {/* Permit number — lg+ */}
      <td className="hidden min-w-[160px] px-5 py-4 lg:table-cell">
        {distributor.permitNumber ? (
          <div className="flex items-center gap-1.5 text-sm text-foreground">
            <Hash className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
            <span className="whitespace-nowrap uppercase">{distributor.permitNumber}</span>
          </div>
        ) : (
          <span className="text-muted-foreground/40">—</span>
        )}
      </td>

      {/* Email — xl+ */}
      <td className="hidden min-w-[200px] px-5 py-4 xl:table-cell">
        {distributor.email ? (
          <div className="flex items-center gap-1.5 text-sm text-foreground">
            <Mail className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
            <span className="max-w-[180px] truncate">{distributor.email}</span>
          </div>
        ) : (
          <span className="text-muted-foreground/40">—</span>
        )}
      </td>

      {/* Sticky right: Action menu */}
      <td className="md:sticky md:right-0 z-[1] w-14 border-l border-border/40 bg-card px-3 py-4 transition-colors group-hover:bg-accent">
        <RowMenu
          t={t}
          onDetails={onDetails}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </td>
    </tr>
  );
}

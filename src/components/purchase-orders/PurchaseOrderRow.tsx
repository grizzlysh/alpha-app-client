import type { JSX } from "react";
import {
  MoreVertical,
  Eye,
  Pencil,
  Trash2,
  Printer,
  // PackageCheck, // disabled — completion handled via invoice
  Ban,
  Repeat,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Translations } from "@/configs/i18n";
import type { PurchaseOrder } from "@/types/purchaseOrder";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  getPOStatusLabel,
  getPOInitials,
  getPOAvatarColor,
  canEdit,
  canPrint,
  // canMarkReceived, // disabled — completion handled via invoice
  canCancel,
  canDelete,
  canRepurchase,
  formatDate,
} from "./purchaseOrderUtils";

export interface PurchaseOrderRowProps {
  order: PurchaseOrder;
  t: Translations;
  onDetails: () => void;
  onEdit: () => void;
  onPrint: () => void;
  // onMarkReceived: () => void; // disabled — completion handled via invoice
  onRepurchase: () => void;
  onCancel: () => void;
  onDelete: () => void;
}

export function PurchaseOrderRow({
  order,
  t,
  onDetails,
  onEdit,
  onPrint,
  // onMarkReceived, // disabled — completion handled via invoice
  onRepurchase,
  onCancel,
  onDelete,
}: PurchaseOrderRowProps): JSX.Element {
  return (
    <tr className="group transition-colors hover:bg-accent/40">
      {/* Sticky left: avatar + order number */}
      <td className="md:sticky md:left-0 z-[1] min-w-[220px] border-r border-border/40 bg-card px-5 py-4 transition-colors group-hover:bg-accent">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-xs font-bold ${getPOAvatarColor(order.orderNumber)}`}
          >
            {getPOInitials(order.orderNumber)}
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium text-foreground">
              {order.orderNumber}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              <span className="uppercase">{order.distributor.name}</span>
            </p>
          </div>
        </div>
      </td>

      {/* Status */}
      <td className="min-w-[120px] px-5 py-4">
        <StatusBadge
          status={order.status}
          label={getPOStatusLabel(order.status, t)}
        />
      </td>

      {/* Items count — sm+ */}
      <td className="hidden min-w-[90px] px-5 py-4 sm:table-cell">
        <span className="text-sm text-foreground">
          {order.details.length}{" "}
          <span className="text-muted-foreground">{t.poItemCount}</span>
        </span>
      </td>

      {/* Ordered At — md+ */}
      <td className="hidden min-w-[130px] px-5 py-4 md:table-cell">
        <span className="text-sm text-foreground">
          {formatDate(order.orderedAt)}
        </span>
      </td>

      {/* Signed By — lg+ */}
      <td className="hidden min-w-[140px] px-5 py-4 lg:table-cell">
        <span className="text-sm text-foreground">
          {order.signedByUser ? order.signedByUser.name : (
            <span className="text-muted-foreground/40">—</span>
          )}
        </span>
      </td>

      {/* Sticky right: action menu */}
      <td className="md:sticky md:right-0 z-[1] w-14 border-l border-border/40 bg-card px-3 py-4 transition-colors group-hover:bg-accent">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 rounded-xl">
            <DropdownMenuItem onClick={onDetails} className="gap-2.5 rounded-lg">
              <Eye className="h-4 w-4 text-muted-foreground" />
              {t.poDetails}
            </DropdownMenuItem>

            {canEdit(order.status) && (
              <DropdownMenuItem onClick={onEdit} className="gap-2.5 rounded-lg">
                <Pencil className="h-4 w-4 text-muted-foreground" />
                {t.poEdit}
              </DropdownMenuItem>
            )}

            {canPrint(order.status) && (
              <DropdownMenuItem onClick={onPrint} className="gap-2.5 rounded-lg">
                <Printer className="h-4 w-4 text-muted-foreground" />
                {order.status === "DRAFT" ? t.poPrint : t.poReprint}
              </DropdownMenuItem>
            )}

            {/* Mark as Received disabled — completion is handled via invoice, not manually */}
            {/* {canMarkReceived(order.status) && (
              <DropdownMenuItem onClick={onMarkReceived} className="gap-2.5 rounded-lg text-success focus:bg-success/10 focus:text-success">
                <PackageCheck className="h-4 w-4" />
                {t.poMarkReceived}
              </DropdownMenuItem>
            )} */}

            {canRepurchase(order.status) && (
              <DropdownMenuItem onClick={onRepurchase} className="gap-2.5 rounded-lg">
                <Repeat className="h-4 w-4 text-muted-foreground" />
                {t.poRepurchase}
              </DropdownMenuItem>
            )}

            {canCancel(order.status) && (
              <DropdownMenuItem onClick={onCancel} className="gap-2.5 rounded-lg text-destructive focus:bg-destructive/10 focus:text-destructive">
                <Ban className="h-4 w-4" />
                {t.poCancel}
              </DropdownMenuItem>
            )}

            {canDelete(order.status) && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={onDelete}
                  className="gap-2.5 rounded-lg text-destructive focus:bg-destructive/10 focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  {t.poDelete}
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}

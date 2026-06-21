import type { JSX } from "react";
import { MoreVertical, Eye, Trash2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Translations } from "@/configs/i18n";
import type { Invoice } from "@/types/invoice";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  getPaymentStatusLabel,
  getInvoiceInitials,
  getInvoiceAvatarColor,
  canDelete,
  formatDate,
  formatCurrency,
} from "./invoiceUtils";

export interface InvoiceRowProps {
  invoice: Invoice;
  t: Translations;
  onDetails: () => void;
  onDelete: () => void;
}

export function InvoiceRow({
  invoice,
  t,
  onDetails,
  onDelete,
}: InvoiceRowProps): JSX.Element {
  return (
    <tr className="group transition-colors hover:bg-accent/40">
      {/* Sticky left: avatar + invoice number + distributor */}
      <td className="md:sticky md:left-0 z-[1] min-w-[220px] border-r border-border/40 bg-card px-5 py-4 transition-colors group-hover:bg-accent">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-xs font-bold ${getInvoiceAvatarColor(invoice.invoiceNumber)}`}
          >
            {getInvoiceInitials(invoice.invoiceNumber)}
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium uppercase text-foreground">
              {invoice.invoiceNumber}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              <span className="uppercase">{invoice.distributor.name}</span>
            </p>
          </div>
        </div>
      </td>

      {/* Payment status */}
      <td className="min-w-[120px] px-5 py-4">
        <StatusBadge
          status={invoice.paymentStatus}
          label={getPaymentStatusLabel(invoice.paymentStatus, t)}
        />
      </td>

      {/* Total amount — sm+ */}
      <td className="hidden min-w-[140px] px-5 py-4 sm:table-cell">
        <span className="text-sm font-medium text-foreground">
          {formatCurrency(invoice.totalAmount)}
        </span>
      </td>

      {/* Invoice date — md+ */}
      <td className="hidden min-w-[130px] px-5 py-4 md:table-cell">
        <span className="text-sm text-foreground">
          {formatDate(invoice.invoiceDate)}
        </span>
      </td>

      {/* Due date — lg+ */}
      <td className="hidden min-w-[130px] px-5 py-4 lg:table-cell">
        <span className="text-sm text-foreground">
          {invoice.dueDate ? formatDate(invoice.dueDate) : (
            <span className="text-muted-foreground/40">—</span>
          )}
        </span>
      </td>

      {/* Items count — xl+ */}
      <td className="hidden min-w-[90px] px-5 py-4 xl:table-cell">
        <span className="text-sm text-foreground">
          {invoice.details.length}{" "}
          <span className="text-muted-foreground">{t.invoiceItemCount}</span>
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
              {t.invoiceDetails}
            </DropdownMenuItem>

            {canDelete(invoice.paymentStatus) && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={onDelete}
                  className="gap-2.5 rounded-lg text-destructive focus:bg-destructive/10 focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  {t.invoiceDelete}
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}

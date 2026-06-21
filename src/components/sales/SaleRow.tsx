import type { JSX } from "react";
import { MoreVertical, Eye, Ban, Undo2, Wallet, CheckCircle2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Translations } from "@/configs/i18n";
import type { Sale } from "@/types/sale";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  getSaleStatusLabel,
  getSaleTypeLabel,
  getSalePaymentStatusLabel,
  getSaleInitials,
  getSaleAvatarColor,
  canCancelSale,
  canRefundSale,
  canAddPayment,
  canCompleteSale,
  formatDate,
  formatCurrency,
} from "./salesUtils";

export interface SaleRowProps {
  sale: Sale;
  t: Translations;
  onDetails: () => void;
  onCancel: () => void;
  onRefund: () => void;
  onAddPayment: () => void;
  onComplete: () => void;
}

export function SaleRow({
  sale,
  t,
  onDetails,
  onCancel,
  onRefund,
  onAddPayment,
  onComplete,
}: SaleRowProps): JSX.Element {
  return (
    <tr className="group transition-colors hover:bg-accent/40">
      {/* Sticky left: avatar + sale number */}
      <td className="md:sticky md:left-0 z-[1] min-w-[220px] border-r border-border/40 bg-card px-5 py-4 transition-colors group-hover:bg-accent">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-xs font-bold ${getSaleAvatarColor(sale.saleNumber)}`}
          >
            {getSaleInitials(sale.saleNumber)}
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium text-foreground">{sale.saleNumber}</p>
            <p className="truncate text-xs uppercase text-muted-foreground">{sale.customer.name}</p>
          </div>
        </div>
      </td>

      {/* Status */}
      <td className="min-w-[120px] px-5 py-4">
        <StatusBadge status={sale.status} label={getSaleStatusLabel(sale.status, t)} />
      </td>

      {/* Sale type — sm+ */}
      <td className="hidden min-w-[100px] px-5 py-4 sm:table-cell">
        <span className="text-sm text-foreground">{getSaleTypeLabel(sale.saleType, t)}</span>
      </td>

      {/* Total amount — md+ */}
      <td className="hidden min-w-[120px] px-5 py-4 md:table-cell">
        <span className="text-sm font-medium text-foreground">
          {formatCurrency(sale.totalAmount)}
        </span>
      </td>

      {/* Payment status — md+ */}
      <td className="hidden min-w-[110px] px-5 py-4 md:table-cell">
        {sale.payment ? (
          <StatusBadge
            status={sale.payment.paymentStatus}
            label={getSalePaymentStatusLabel(sale.payment.paymentStatus, t)}
          />
        ) : (
          <span className="text-muted-foreground/40">—</span>
        )}
      </td>

      {/* Sold at — lg+ */}
      <td className="hidden min-w-[140px] px-5 py-4 lg:table-cell">
        <span className="text-sm text-foreground">{formatDate(sale.soldAt)}</span>
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
              {t.saleDetails}
            </DropdownMenuItem>

            {canCompleteSale(sale.status) && (
              <DropdownMenuItem
                onClick={onComplete}
                className="gap-2.5 rounded-lg text-success focus:bg-success/10 focus:text-success"
              >
                <CheckCircle2 className="h-4 w-4" />
                {t.saleComplete}
              </DropdownMenuItem>
            )}

            {canAddPayment(sale.status, sale.saleType, sale.payment?.paymentStatus) && (
              <DropdownMenuItem onClick={onAddPayment} className="gap-2.5 rounded-lg">
                <Wallet className="h-4 w-4 text-muted-foreground" />
                {t.salePaymentAdd}
              </DropdownMenuItem>
            )}

            {(canCancelSale(sale.status) || canRefundSale(sale.status)) && <DropdownMenuSeparator />}

            {canRefundSale(sale.status) && (
              <DropdownMenuItem
                onClick={onRefund}
                className="gap-2.5 rounded-lg text-amber-600 focus:bg-amber-100 focus:text-amber-700 dark:text-amber-400"
              >
                <Undo2 className="h-4 w-4" />
                {t.saleRefund}
              </DropdownMenuItem>
            )}

            {canCancelSale(sale.status) && (
              <DropdownMenuItem
                onClick={onCancel}
                className="gap-2.5 rounded-lg text-destructive focus:bg-destructive/10 focus:text-destructive"
              >
                <Ban className="h-4 w-4" />
                {t.saleCancel}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}

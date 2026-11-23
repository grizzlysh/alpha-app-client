import type { JSX } from "react";

import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/utils/cn";
import { type OrderLetterKind, orderLetterKindLabel } from "@/utils/orderLetter";

export interface OrderLetterBadgeProps {
  kind: OrderLetterKind;
  className?: string;
}

const TONE: Record<OrderLetterKind, string> = {
  REGULAR: "bg-muted text-muted-foreground",
  NARCOTIC: "bg-destructive/10 text-destructive",
  PSYCHOTROPIC: "bg-destructive/10 text-destructive",
  PRECURSOR: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  CERTAIN_DRUG: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
};

/** Which surat pesanan an order is: "SP Narkotika", "SP Reguler"… */
export function OrderLetterBadge({ kind, className }: OrderLetterBadgeProps): JSX.Element {
  const { t } = useLanguage();
  return (
    <span className={cn("inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium", TONE[kind], className)}>
      SP {orderLetterKindLabel(kind, t)}
    </span>
  );
}

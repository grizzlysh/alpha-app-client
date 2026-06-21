import type { JSX } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, PackageCheck, SlidersHorizontal, FilePlus2 } from "lucide-react";

import { Card } from "@/components/ui/card";
import type { Translations } from "@/configs/i18n";

export interface DashboardQuickActionsProps {
  t: Translations;
}

export function DashboardQuickActions({ t }: DashboardQuickActionsProps): JSX.Element {
  const navigate = useNavigate();

  const actions = [
    { key: "sell", icon: ShoppingCart, label: t.dashboardActionSell, path: "/pos" },
    { key: "receive", icon: PackageCheck, label: t.dashboardActionReceiveGoods, path: "/purchase-orders" },
    { key: "adjust", icon: SlidersHorizontal, label: t.dashboardActionAdjustStock, path: "/stock" },
    { key: "createPo", icon: FilePlus2, label: t.dashboardActionCreatePO, path: "/purchase-orders" },
  ];

  return (
    <Card className="p-4">
      <p className="mb-3 text-sm font-semibold text-foreground">{t.dashboardQuickActionsTitle}</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {actions.map((action) => (
          <button
            key={action.key}
            type="button"
            onClick={() => navigate(action.path)}
            className="flex flex-col items-center gap-2 rounded-xl border border-border bg-muted/20 px-3 py-4 text-center transition-colors hover:border-primary/40 hover:bg-accent"
          >
            <action.icon className="h-5 w-5 text-foreground" />
            <span className="text-xs font-medium text-foreground">{action.label}</span>
          </button>
        ))}
      </div>
    </Card>
  );
}

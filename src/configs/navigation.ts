import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Pill,
  FileText,
  ClipboardList,
  Receipt,
  Users,
  Truck,
  BarChart2,
  Settings,
  LibraryBig,
  BriefcaseBusiness,
  UserRoundKey,
  MonitorCog,
  Hospital,
  ArchiveX,
  Undo2,
  ArrowLeftRight,
  History,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Translations } from "@/configs/i18n";

export interface NavItem {
  key: string;
  labelKey: keyof Translations;
  icon: LucideIcon;
  path: string;
  end?: boolean;
}

export interface NavGroup {
  items: NavItem[];
}

// Shown when no pharmacy is selected (PLATFORM_ADMIN)
export const GLOBAL_NAV_GROUPS: NavGroup[] = [
  {
    items: [
      { key: "dashboard", labelKey: "navDashboard", icon: LayoutDashboard, path: "/", end: true },
    ],
  },
  {
    items: [
      { key: "users", labelKey: "navUsers", icon: Users, path: "/users" },
      { key: "pharmacies", labelKey: "navPharmacies", icon: Hospital, path: "/pharmacies" },
      { key: "roles", labelKey: "navRoles", icon: UserRoundKey, path: "/roles" },
    ],
  },
  {
    items: [
      { key: "system-parameters", labelKey: "navSystemParameters", icon: MonitorCog, path: "/system-parameters" },
    ],
  },
];

// Shown when pharmacy staff has no pharmacy selected (multiple placements)
export const PHARMACY_STAFF_PRE_SELECT_NAV_GROUPS: NavGroup[] = [
  {
    items: [
      { key: "dashboard", labelKey: "navDashboard", icon: LayoutDashboard, path: "/", end: true },
    ],
  },
];

// Shown when a pharmacy is selected (pharmacy-context dashboard)
export const PHARMACY_NAV_GROUPS: NavGroup[] = [
  {
    items: [
      { key: "dashboard", labelKey: "navDashboard", icon: LayoutDashboard, path: "/dashboard" },
    ],
  },
  {
    items: [
      { key: "pos", labelKey: "navPOS", icon: ShoppingCart, path: "/pos" },
      { key: "sales", labelKey: "navSales", icon: History, path: "/sales" },
      { key: "prescriptions", labelKey: "navPrescriptions", icon: FileText, path: "/prescriptions" },
      { key: "customers", labelKey: "navCustomers", icon: Users, path: "/customers" },
    ],
  },
  {
    items: [
      { key: "medicines", labelKey: "navMedicines", icon: Pill, path: "/medicines" },
      { key: "medicine-classification", labelKey: "navMedicineClassification", icon: LibraryBig, path: "/medicine-classification" },
      { key: "stock", labelKey: "navStock", icon: Package, path: "/stock" },
      { key: "stock-disposals", labelKey: "navStockDisposals", icon: ArchiveX, path: "/stock-disposals" },
      { key: "stock-returns", labelKey: "navStockReturns", icon: Undo2, path: "/stock-returns" },
      { key: "stock-movements", labelKey: "navStockMovements", icon: ArrowLeftRight, path: "/stock-movements" },
    ],
  },
  {
    items: [
      { key: "purchase-orders", labelKey: "navPurchaseOrders", icon: ClipboardList, path: "/purchase-orders" },
      { key: "distributors", labelKey: "navDistributors", icon: Truck, path: "/distributors" },
      { key: "invoices", labelKey: "navInvoices", icon: Receipt, path: "/invoices" },
    ],
  },
  {
    items: [
      { key: "reports", labelKey: "navReports", icon: BarChart2, path: "/reports" },
      { key: "business-parameters", labelKey: "navBusinessParameters", icon: BriefcaseBusiness, path: "/business-parameters" },
      { key: "settings", labelKey: "navSettings", icon: Settings, path: "/settings" },
    ],
  },
];

// Union used only for resolving the page title in DashboardLayout
export const NAV_GROUPS: NavGroup[] = [
  ...GLOBAL_NAV_GROUPS,
  ...PHARMACY_STAFF_PRE_SELECT_NAV_GROUPS,
  ...PHARMACY_NAV_GROUPS,
];

import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Pill,
  FileText,
  ClipboardList,
  ClipboardPlus,
  Receipt,
  Users,
  Truck,
  BarChart2,
  LibraryBig,
  BriefcaseBusiness,
  UserRoundKey,
  MonitorCog,
  Hospital,
  ArchiveX,
  Undo2,
  ArrowLeftRight,
  History,
  Warehouse,
  Boxes,
  Stethoscope,
  HeartPulse,
  Timer,
  ScanBarcode,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useSelector } from "react-redux";
import type { Translations } from "@/configs/i18n";
import type { RootState } from "@/store";
import { useCan, type PermissionCheck } from "@/hooks/usePermission";

export interface NavItem {
  key: string;
  labelKey: keyof Translations;
  icon: LucideIcon;
  path: string;
  end?: boolean;
  /** Hidden from the menu unless the user holds this permission (any of, if an array). */
  permission?: PermissionCheck;
  /** Only the platform admin sees it (other platform roles do not). */
  platformAdminOnly?: boolean;
}

export interface NavGroup {
  label?: keyof Translations;
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
      { key: "background-jobs", labelKey: "navBackgroundJobs", icon: Timer, path: "/background-jobs", platformAdminOnly: true },
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

// Shown when an owner has no pharmacy selected — same as staff pre-select plus People management
export const PHARMACY_OWNER_PRE_SELECT_NAV_GROUPS: NavGroup[] = [
  ...PHARMACY_STAFF_PRE_SELECT_NAV_GROUPS,
  {
    label: "navGroupPeople",
    items: [
      // Pre-select tokens carry no permissions, so these only appear for platform admins.
      { key: "users", labelKey: "navUsers", icon: Users, path: "/users", permission: "users.read" },
      { key: "roles", labelKey: "navRoles", icon: UserRoundKey, path: "/roles", permission: "roles.read" },
    ],
  },
];

// Shown when a pharmacy is selected (pharmacy-context dashboard)
export const PHARMACY_NAV_GROUPS: NavGroup[] = [
  {
    items: [
      { key: "dashboard", labelKey: "navDashboard", icon: LayoutDashboard, path: "/dashboard", permission: "dashboard.read" },
    ],
  },
  {
    label: "navGroupSales",
    items: [
      { key: "pos", labelKey: "navPOS", icon: ShoppingCart, path: "/pos", permission: "sales.create" },
      { key: "sales", labelKey: "navSales", icon: History, path: "/sales", permission: "sales.read" },
      { key: "prescriptions", labelKey: "navPrescriptions", icon: FileText, path: "/prescriptions", permission: "prescriptions.read" },
      { key: "customers", labelKey: "navCustomers", icon: Users, path: "/customers", permission: "customers.read" },
      { key: "examinations", labelKey: "navExaminations", icon: HeartPulse, path: "/examinations", permission: "examinations.read" },
      { key: "medical-records", labelKey: "navMedicalRecords", icon: ClipboardPlus, path: "/medical-records", permission: "medical_records.read" },
    ],
  },
  {
    label: "navGroupInventory",
    items: [
      { key: "medicines", labelKey: "navMedicines", icon: Pill, path: "/medicines", permission: "medicines.read" },
      { key: "medicine-classification", labelKey: "navMedicineClassification", icon: LibraryBig, path: "/medicine-classification", permission: ["medicine_types.read", "medicine_shapes.read", "medicine_classes.read"] },
      { key: "stock", labelKey: "navStock", icon: Package, path: "/stock", permission: "stock.read" },
      { key: "stock-labels", labelKey: "navStockLabels", icon: ScanBarcode, path: "/stock-labels", permission: "stock.read" },
      { key: "stock-disposals", labelKey: "navStockDisposals", icon: ArchiveX, path: "/stock-disposals", permission: "stock_disposal.read" },
      { key: "stock-returns", labelKey: "navStockReturns", icon: Undo2, path: "/stock-returns", permission: "stock_return.read" },
      { key: "stock-movements", labelKey: "navStockMovements", icon: ArrowLeftRight, path: "/stock-movements", permission: "stock_movements.read" },
      { key: "storage", labelKey: "navStorage", icon: Warehouse, path: "/storage", permission: "storage.read" },
      { key: "inventory", labelKey: "navInventory", icon: Boxes, path: "/inventory", permission: "storage.read" },
    ],
  },
  {
    label: "navGroupProcurement",
    items: [
      { key: "purchase-orders", labelKey: "navPurchaseOrders", icon: ClipboardList, path: "/purchase-orders", permission: "purchase_orders.read" },
      { key: "distributors", labelKey: "navDistributors", icon: Truck, path: "/distributors", permission: "distributors.read" },
      { key: "invoices", labelKey: "navInvoices", icon: Receipt, path: "/invoices", permission: "invoices.read" },
    ],
  },
  {
    label: "navGroupPeople",
    items: [
      { key: "users", labelKey: "navUsers", icon: Users, path: "/users", permission: "users.read" },
      { key: "roles", labelKey: "navRoles", icon: UserRoundKey, path: "/roles", permission: "roles.read" },
      { key: "doctors", labelKey: "navDoctors", icon: Stethoscope, path: "/doctors", permission: "doctors.read" },
    ],
  },
  {
    label: "navGroupSettings",
    items: [
      { key: "reports", labelKey: "navReports", icon: BarChart2, path: "/reports", permission: "reports.read" },
      { key: "business-parameters", labelKey: "navBusinessParameters", icon: BriefcaseBusiness, path: "/business-parameters", permission: "business_parameters.read" },
      // The selected pharmacy's own details and business licenses.
      { key: "pharmacy-profile", labelKey: "navPharmacyProfile", icon: Hospital, path: "/pharmacy-profile", permission: "pharmacies.update" },
    ],
  },
];

// Union used only for resolving the page title in DashboardLayout
export const NAV_GROUPS: NavGroup[] = [
  ...GLOBAL_NAV_GROUPS,
  ...PHARMACY_STAFF_PRE_SELECT_NAV_GROUPS,
  ...PHARMACY_NAV_GROUPS,
];

/** Every pharmacy route and the permission needed to open it (used by route guards). */
export const PHARMACY_ROUTE_PERMISSIONS: Record<string, PermissionCheck> = Object.fromEntries(
  PHARMACY_NAV_GROUPS.flatMap((g) => g.items.map((item) => [item.path, item.permission]))
);

/** Filters nav groups to the items the user may open, dropping empty groups. */
export function filterNavGroups(groups: NavGroup[], can: (check: PermissionCheck) => boolean): NavGroup[] {
  return groups
    .map((g) => ({ ...g, items: g.items.filter((item) => can(item.permission)) }))
    .filter((g) => g.items.length > 0);
}

/**
 * Where to send a user after selecting a pharmacy (or from "back to home"):
 * the first menu entry they can actually open, so a role without dashboard
 * access doesn't land on a forbidden page.
 */
export function useLandingPath(): string {
  const can = useCan();
  const pharmacySelected = useSelector((state: RootState) => state.auth.pharmacySelected);
  if (!pharmacySelected) return "/";
  const first = filterNavGroups(PHARMACY_NAV_GROUPS, can)[0]?.items[0];
  return first?.path ?? "/profile";
}

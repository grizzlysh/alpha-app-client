import type { Query } from "@tanstack/react-query";
import { queryClient } from "./queryClient";

/**
 * Central cache invalidation after any successful write.
 *
 * Screens cache lists and dropdowns (5 min staleTime, some persisted to
 * IndexedDB). Hand-written invalidations per mutation kept missing keys, e.g. a
 * new medicine type never reached `medicine-types-dropdown`. Instead, every
 * non-GET response that succeeds marks every query that depends on that API
 * resource as stale: mounted queries refetch at once, others on next mount.
 *
 * Keys are matched on their first element. Add a key here when you add a query
 * whose data comes from (or is derived from) another resource.
 */

const STOCK = [
  "stocks",
  "stock-catalog",
  "stock-details-search",
  "stock-available",
  "stocks-for-return",
  "stock-movements",
  "inventory-tree",
  "inventory-bin-items",
  "batch-label",
  "medicine-stock-card",
  "stock-label-search",
  "stock-label-medicines",
];

const CUSTOMERS = [
  "customers",
  "customers-dropdown",
  "customers-patients",
  "customer-detail",
  "patients",
  "patients-dropdown",
];

const PRESCRIPTIONS = ["prescriptions", "prescription", "prescriptions-queue"];

// API mount point (first path segment) → query key roots that depend on it.
const DEPENDENCIES: Record<string, string[]> = {
  users: ["users", "user", "users-dropdown", "users-all", "user-placements", "licenses", "doctors", "doctors-dropdown", "me"],
  // Creating a pharmacy can also create its owner's account.
  pharmacies: ["pharmacies", "pharmacy", "pharmacies-ddl", "pharmacy-detail", "pharmacy-biz-licenses", "pharmacy-setup", "me", "users"],
  roles: ["roles", "role", "roles-ddl", "users", "user-placements"],
  permissions: ["permissions-all", "roles", "role"],
  "system-parameters": ["system-parameters"],
  // The medicine name format renames medicines; the margin reprices stock.
  "business-parameters": ["business-parameters", "medicines", "medicines-dropdown", ...STOCK],
  distributors: ["distributors", "distributors-dropdown", "purchase-orders", "invoices"],
  customers: [...CUSTOMERS, "medical-record", "medical-visits", "examinations", "examination"],
  medicines: ["medicines", "medicines-dropdown", "purchase-orders", ...STOCK],
  // Structured medicine names include the shape.
  "medicine-shapes": ["medicine-shapes-dropdown", "medicines", "medicines-dropdown", ...STOCK],
  "medicine-types": ["medicine-types-dropdown", "medicines", "medicines-dropdown", "stock-catalog"],
  "medicine-classes": ["medicine-classes-dropdown", "medicines", "medicines-dropdown"],
  // Spreadsheet imports of starting data; opening stock is booked as receipts.
  "data-transfer": [
    "distributors", "distributors-dropdown", ...CUSTOMERS, "invoices", "invoice", "pharmacy-setup", ...STOCK,
  ],
  // Import adds medicines and any missing classifications.
  catalog: [
    "medicines", "medicines-dropdown", "pharmacy-setup",
    "medicine-shapes", "medicine-shapes-dropdown", "medicine-types", "medicine-types-dropdown",
    "medicine-classes", "medicine-classes-dropdown", "stock-catalog",
  ],
  "purchase-orders": ["purchase-orders", "purchase-orders-dropdown", "purchase-order-print"],
  invoices: [
    "invoices", "invoice", "invoice-payment", "invoices-search-for-return", "invoice-for-return",
    "purchase-orders", "purchase-orders-dropdown", ...STOCK,
  ],
  stock: STOCK,
  "stock-returns": ["stock-returns", "invoice-for-return", "invoices-search-for-return", ...STOCK],
  "stock-disposals": ["stock-disposals", "stock-disposal", ...STOCK],
  "stock-movements": STOCK,
  sales: ["sales", "sale", ...STOCK, ...PRESCRIPTIONS, "customer-detail", "customer-purchases"],
  storage: [
    "storage-cabinets", "storage-shelves", "storage-bins",
    "cabinets-dropdown", "shelves-dropdown", "bins-dropdown", "medicines", ...STOCK,
  ],
  inventory: STOCK,
  doctors: ["doctors", "doctors-dropdown", ...PRESCRIPTIONS, "medical-visits"],
  prescriptions: [...PRESCRIPTIONS, "medical-visits", "examinations", "examination", "sales", "sale", ...STOCK],
  "medical-records": ["medical-record", "medical-visits", "examinations", "examination", ...CUSTOMERS],
  examinations: ["examinations", "examination", "medical-record", "medical-visits", ...PRESCRIPTIONS, "customers-patients"],
};

// Aggregates computed from everything: refresh after any write.
const ALWAYS = (root: string): boolean => root.startsWith("dashboard") || root.startsWith("report-");

// Writes that change no cached data.
const IGNORED = new Set(["auth"]);

function resourceOf(url: string): string | null {
  const path = url.replace(/^https?:\/\/[^/]+/, "").replace(/^\/?api\//, "").replace(/^\//, "");
  const first = path.split(/[/?#]/)[0];
  return first || null;
}

export function invalidateAfterWrite(method: string | undefined, url: string | undefined): void {
  const m = (method ?? "get").toLowerCase();
  if (m === "get" || m === "head" || m === "options" || !url) return;

  // Read-only POSTs (a long list in the body) change nothing.
  if (/\/allergy-check(\?|$)/.test(url)) return;

  const resource = resourceOf(url);
  if (!resource || IGNORED.has(resource)) return;

  const roots = new Set(DEPENDENCIES[resource] ?? []);
  // Unmapped resource: fall back to keys named after it ("foo", "foo-dropdown"...).
  const matchesPrefix = (root: string) => root === resource || root.startsWith(`${resource}-`);

  void queryClient.invalidateQueries({
    predicate: (query: Query) => {
      const root = query.queryKey[0];
      if (typeof root !== "string") return false;
      return roots.has(root) || matchesPrefix(root) || ALWAYS(root);
    },
  });
}

import type { Translations } from "@/configs/i18n";

const ACTION_LABELS: Record<string, keyof Translations> = {
  "users.create": "audit_users_create",
  "users.update": "audit_users_update",
  "users.delete": "audit_users_delete",
  "users.reset_password": "audit_users_reset_password",
  "placements.create": "audit_placements_create",
  "placements.update": "audit_placements_update",
  "placements.delete": "audit_placements_delete",
  "roles.create": "audit_roles_create",
  "roles.update": "audit_roles_update",
  "roles.delete": "audit_roles_delete",
  "roles.set_permissions": "audit_roles_set_permissions",
  "business_parameters.update": "audit_business_parameters_update",
  "stock.update_price": "audit_stock_update_price",
  "stock.adjust": "audit_stock_adjust",
  "sales.cancel": "audit_sales_cancel",
  "sales.refund": "audit_sales_refund",
  "shifts.open": "audit_shifts_open",
  "shifts.close": "audit_shifts_close",
  "shifts.cash_in": "audit_shifts_cash_in",
  "shifts.cash_out": "audit_shifts_cash_out",
  "medicines.delete": "audit_medicines_delete",
  "pharmacies.update": "audit_pharmacies_update",
  "auth.enter_pharmacy": "audit_auth_enter_pharmacy",
  "auth.account_locked": "audit_auth_account_locked",
};

const MODULE_LABELS: Record<string, keyof Translations> = {
  users: "auditModule_users",
  placements: "auditModule_placements",
  roles: "auditModule_roles",
  business_parameters: "auditModule_business_parameters",
  stock: "auditModule_stock",
  sales: "auditModule_sales",
  shifts: "auditModule_shifts",
  medicines: "auditModule_medicines",
  pharmacies: "auditModule_pharmacies",
  auth: "auditModule_auth",
};

/** A readable activity name; unknown actions fall back to their code. */
export function auditActionLabel(action: string, t: Translations): string {
  const key = ACTION_LABELS[action];
  return key ? t[key] : action;
}

export function auditModuleLabel(module: string, t: Translations): string {
  const key = MODULE_LABELS[module];
  return key ? t[key] : module;
}

/** "SHIFT_NOT_OPEN" style codes and camelCase fields made readable. */
export function humanizeField(field: string): string {
  return field.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/_/g, " ").toLowerCase();
}

export function formatAuditValue(value: unknown, empty: string): string {
  if (value === null || value === undefined || value === "") return empty;
  if (typeof value === "boolean") return value ? "✓" : "✗";
  if (Array.isArray(value)) return value.length ? value.join(", ") : empty;
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
    return new Date(value).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
  }
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

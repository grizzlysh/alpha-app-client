export type ShiftStatus = "OPEN" | "CLOSED";
export type ShiftCashMovementType = "IN" | "OUT";

export interface ShiftSettings {
  enabled: boolean;
  openingCash: number;
  blindClose: boolean;
  differenceTolerance: number;
}

export interface ShiftSummary {
  saleCount: number;
  cashSales: number;
  nonCashSales: number;
  cashRefunds: number;
  cashIn: number;
  cashOut: number;
  expectedCash: number;
}

export interface ShiftPerson {
  uuid: string;
  name: string;
}

export interface Shift {
  uuid: string;
  shiftNumber: string;
  status: ShiftStatus;
  cashier: ShiftPerson;
  openedAt: string;
  openingCash: number;
  openingNote: string | null;
  closedAt: string | null;
  closedBy: ShiftPerson | null;
  countedCash: number | null;
  difference: number | null;
  closingNote: string | null;
  /** Null while a blind-close shift is open (the cashier may not see it). */
  summary: ShiftSummary | null;
}

export interface ShiftCashMovement {
  uuid: string;
  type: ShiftCashMovementType;
  amount: number;
  note: string;
  createdAt: string;
  createdBy: string | null;
}

export interface ShiftSale {
  uuid: string;
  saleNumber: string;
  soldAt: string;
  status: string;
  saleType: string;
  grandTotal: number;
  refundedHere: boolean;
}

export interface ShiftDetail extends Shift {
  cashMovements: ShiftCashMovement[];
  sales: ShiftSale[];
}

export interface CurrentShift {
  settings: ShiftSettings;
  shift: Shift | null;
}

export interface ShiftListParams {
  status?: ShiftStatus;
  cashierUuid?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export interface OpenShiftPayload {
  openingCash: number;
  note?: string;
}

export interface CloseShiftPayload {
  countedCash: number;
  note?: string;
}

export interface ShiftCashMovementPayload {
  type: ShiftCashMovementType;
  amount: number;
  note: string;
}

/** Business parameters behind the shift settings. */
export const SHIFT_PARAM_KEYS = {
  enabled: "CASHIER_SHIFT_ENABLED",
  openingCash: "CASHIER_SHIFT_OPENING_CASH",
  blindClose: "CASHIER_SHIFT_BLIND_CLOSE",
  differenceTolerance: "CASHIER_SHIFT_DIFFERENCE_TOLERANCE",
} as const;

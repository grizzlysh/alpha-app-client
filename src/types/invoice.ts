export type PaymentStatus = "UNPAID" | "PARTIAL" | "PAID";
export type PaymentMethod = "CASH" | "TRANSFER" | "CREDIT";

export interface InvoiceMedicine {
  uuid: string;
  name: string;
  unit: string;
}

export interface InvoiceDetail {
  uuid: string;
  batchNumber: string;
  expiryDate: string;
  quantityBox: number;
  quantityPerBox: number;
  quantityPieces: number;
  price: number;
  discountPercentage: number;
  discountAmount: number;
  finalPrice: number;
  totalAmount: number;
  medicine: InvoiceMedicine;
  stockDetail: { uuid: string; quantityPieces: number; quantityBox: number } | null;
}

export interface InvoiceParty {
  uuid: string;
  name: string;
}

export interface InvoicePurchaseOrder {
  uuid: string;
  orderNumber: string;
}

export interface InvoicePaymentHistory {
  uuid: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentDate: string;
  description: string | null;
}

export interface InvoicePayment {
  uuid: string;
  totalAmount: number;
  paidAmount: number;
  paymentStatus: PaymentStatus;
  history: InvoicePaymentHistory[];
}

export interface Invoice {
  uuid: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string | null;
  receiveDate: string | null;
  // totalAmount: final total the buyer pays (= server's grandTotal after normalization)
  totalAmount: number;
  paidAmount: number;
  paymentStatus: PaymentStatus;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  // ppnNominal: PPN tax amount in currency (= server's ppnAmount after normalization)
  ppnNominal: number;
  ppnEnabled: boolean;
  ppnPercentage: number;
  distributor: InvoiceParty;
  purchaseOrder: InvoicePurchaseOrder | null;
  signedBy: InvoiceParty | null;
  details: InvoiceDetail[];
  payment: InvoicePayment | null;
}

// ── Raw server shape (pre-normalization) ─────────────
// The server uses different field names for some fields; this type captures
// what actually arrives over the wire before normalizeInvoice maps it.
export interface InvoiceRaw extends Omit<Invoice, "totalAmount" | "ppnNominal" | "ppnEnabled" | "ppnPercentage" | "signedBy" | "payment"> {
  grandTotal?: number;
  totalAmount?: number;
  ppnAmount?: number;
  ppnPercentage?: number;
  signedByUser?: InvoiceParty | null;
  signedBy?: InvoiceParty | null;
  payment?: InvoicePayment | null;
  payments?: InvoicePayment[] | null;
}

// ── List params ───────────────────────────────────────

export interface InvoiceListParams {
  search?: string;
  paymentStatus?: PaymentStatus;
  distributorUuid?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: "invoiceDate" | "createdAt" | "totalAmount";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

// ── Create payloads ───────────────────────────────────

export interface CreateInvoiceDetailPayload {
  medicineUuid: string;
  batchNumber: string;
  expiryDate: string;
  quantityBox: number;
  quantityPerBox: number;
  quantityPieces: number;
  price: number;
  discountPercentage?: number;
  binUuid?: string;
}

export interface CreateInvoicePayload {
  distributorUuid: string;
  purchaseOrderUuid?: string;
  signedByUuid?: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate?: string;
  receiveDate?: string;
  description?: string;
  ppnEnabled?: boolean;
  details: CreateInvoiceDetailPayload[];
}

// ── Payment payloads ──────────────────────────────────

export interface AddPaymentPayload {
  amount: number;
  paymentMethod: PaymentMethod;
  paymentDate: string;
  description?: string;
}

export interface UpdatePaymentHistoryPayload {
  paymentMethod?: PaymentMethod;
  paymentDate?: string;
  description?: string;
}

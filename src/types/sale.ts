export type SaleStatus = "PENDING" | "COMPLETED" | "CANCELLED" | "REFUNDED";
export type SaleType = "CASH" | "CREDIT";
export type PaymentStatus = "UNPAID" | "PARTIAL" | "PAID";
export type PaymentMethod = "CASH" | "TRANSFER" | "CREDIT";

export interface SaleMedicine {
  uuid: string;
  name: string;
  unit: string;
}

export interface SaleBatch {
  uuid: string;
  batchNumber: string;
  expiryDate: string;
}

export interface SaleCustomer {
  uuid: string;
  name: string;
  isWalkIn: boolean;
}

export interface SaleDetail {
  uuid: string;
  quantityPieces: number;
  quantityBox: number;
  sellingPrice: number;
  originalPrice: number;
  discountPercentage: number;
  discountAmount: number;
  totalAmount: number;
  isFefoOverride: boolean;
  medicine: SaleMedicine;
  stockDetail: SaleBatch;
}

// PATCH /sales/:uuid — update a PENDING sale without completing it
export interface UpdateSalePayload {
  customerUuid?: string;
  saleType?: SaleType;
  discountPercentage?: number;
  discountAmount?: number;
  ppnPercentage?: number;
  ppnAmount?: number;
  totalAmount: number;
  grandTotal: number;
  description?: string;
  details: CreateSaleDetailPayload[];
}

export interface SalePaymentHistory {
  uuid: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentDate: string;
  description: string | null;
}

export interface SalePayment {
  uuid: string;
  totalAmount: number;
  paidAmount: number;
  paymentStatus: PaymentStatus;
  history: SalePaymentHistory[];
}

export interface Sale {
  uuid: string;
  saleNumber: string;
  saleType: SaleType;
  status: SaleStatus;
  totalAmount: number;
  discountPercentage: number;
  discountAmount: number;
  ppnPercentage: number;
  ppnAmount: number;
  grandTotal: number;
  paidAmount: number;
  dueDate: string | null;
  description: string | null;
  soldAt: string;
  createdAt: string;
  customer: SaleCustomer;
  details: SaleDetail[];
  payment: SalePayment | null;
}

export interface SaleListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: SaleStatus;
  saleType?: SaleType;
  paymentStatus?: PaymentStatus;
  customerUuid?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: "saleNumber" | "soldAt" | "totalAmount";
  sortOrder?: "asc" | "desc";
}

export interface CreateSaleDetailPayload {
  stockDetailUuid: string;
  quantityPieces: number;
  sellingPrice: number;
  originalPrice?: number;
  discountPercentage?: number;
  discountAmount?: number;
  isFefoOverride?: boolean;
}

export interface CreateSalePaymentPayload {
  paymentMethod: PaymentMethod;
  description?: string;
}

export interface CreateSalePayload {
  customerUuid?: string;
  saleType?: SaleType;
  discountPercentage?: number;
  discountAmount?: number;
  ppnPercentage?: number;
  ppnAmount?: number;
  totalAmount: number;
  grandTotal: number;
  paidAmount?: number;
  description?: string;
  isPending?: boolean;
  details: CreateSaleDetailPayload[];
  payment?: CreateSalePaymentPayload;
}

export interface CancelSalePayload {
  description: string;
}

export interface RefundSalePayload {
  description: string;
}

export interface AddSalePaymentPayload {
  paidAmount: number;
  paymentMethod: PaymentMethod;
  paymentDate: string;
  description?: string;
}

export interface UpdatePaymentHistoryPayload {
  paymentMethod?: PaymentMethod;
  paymentDate?: string;
  description?: string;
}

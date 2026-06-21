import { axiosInstance } from "@/configs/axiosInstance";
import type { ApiResponse } from "@/types/api";
import type {
  Invoice,
  InvoiceRaw,
  InvoiceListParams,
  CreateInvoicePayload,
} from "@/types/invoice";

const EMPTY_204: ApiResponse<null> = {
  success: true,
  code: "",
  data: null,
  message: { en: "", id: "" },
  errors: null,
  meta: null,
};

// ── Normalizer ────────────────────────────────────────
// Maps server field names → client field names so the rest of the app
// works without knowing about the server's internal naming.

function normalizeInvoice(raw: InvoiceRaw): Invoice {
  const ppnPercentage = raw.ppnPercentage ?? 0;
  return {
    ...raw,
    // Server sends grandTotal (post-PPN) as the amount the buyer pays.
    // The client uses totalAmount for that purpose.
    totalAmount: raw.grandTotal ?? raw.totalAmount ?? 0,
    // ppnAmount → ppnNominal (currency amount of the tax, for breakdown display)
    ppnNominal: raw.ppnAmount ?? 0,
    ppnEnabled: ppnPercentage > 0,
    ppnPercentage,
    // signedByUser → signedBy (Prisma relation name vs client field name)
    signedBy: raw.signedBy ?? raw.signedByUser ?? null,
    // payments array (server) → payment singular (first element)
    payment: raw.payment ?? (Array.isArray(raw.payments) ? (raw.payments[0] ?? null) : null),
  };
}

// ── Service functions ─────────────────────────────────

export async function getInvoices(
  params?: InvoiceListParams
): Promise<ApiResponse<Invoice[]>> {
  const response = await axiosInstance.get<ApiResponse<InvoiceRaw[]>>("/invoices", {
    params,
  });
  if (response.data.data) {
    response.data.data = response.data.data.map(normalizeInvoice);
  }
  return response.data as ApiResponse<Invoice[]>;
}

export async function getInvoice(uuid: string): Promise<ApiResponse<Invoice>> {
  const response = await axiosInstance.get<ApiResponse<InvoiceRaw>>(
    `/invoices/${uuid}`
  );
  if (response.data.data) {
    response.data.data = normalizeInvoice(response.data.data);
  }
  return response.data as ApiResponse<Invoice>;
}

export async function createInvoice(
  payload: CreateInvoicePayload
): Promise<ApiResponse<Invoice>> {
  const response = await axiosInstance.post<ApiResponse<InvoiceRaw>>(
    "/invoices",
    payload
  );
  if (response.data.data) {
    response.data.data = normalizeInvoice(response.data.data);
  }
  return response.data as ApiResponse<Invoice>;
}

export async function deleteInvoice(uuid: string): Promise<ApiResponse<null>> {
  const response = await axiosInstance.delete<ApiResponse<null>>(
    `/invoices/${uuid}`
  );
  if (response.status === 204 || !response.data) return EMPTY_204;
  return response.data;
}

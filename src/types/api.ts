export interface BilingualMessage {
  en: string;
  id: string;
}

export interface BilingualErrors {
  [field: string]: BilingualMessage;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  code: string;
  message: BilingualMessage;
  data: T | null;
  errors: BilingualErrors | null;
  meta: PaginationMeta | null;
}

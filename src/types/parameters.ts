export interface Parameter {
  uuid: string;
  key: string;
  value: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ParameterListParams {
  search?: string;
  sortBy?: "key" | "createdAt";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface UpdateParameterPayload {
  value: string;
  description?: string;
}

export interface Customer {
  uuid: string;
  name: string;
  phone: string | null;
  address: string | null;
  description: string | null;
  isWalkIn: boolean;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
}

export interface CustomerListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: "ACTIVE" | "INACTIVE";
  isWalkIn?: boolean;
}

export interface CreateCustomerPayload {
  name: string;
  phone?: string;
  address?: string;
  description?: string;
}

export interface UpdateCustomerPayload {
  name?: string;
  phone?: string;
  address?: string;
  description?: string;
  status?: "ACTIVE" | "INACTIVE";
}

export interface CustomerDropdownItem {
  uuid: string;
  name: string;
  phone: string | null;
  isWalkIn: boolean;
}

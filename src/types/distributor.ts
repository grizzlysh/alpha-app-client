export interface Distributor {
  uuid: string;
  name: string;
  email: string | null;
  phone: string;
  address: string;
  contactPerson: string | null;
  permitNumber: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DistributorListParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface CreateDistributorPayload {
  name: string;
  phone: string;
  address: string;
  email?: string;
  contactPerson?: string;
  permitNumber?: string;
  description?: string;
}

export type UpdateDistributorPayload = CreateDistributorPayload;

export interface DistributorDropdownItem {
  uuid: string;
  name: string;
}

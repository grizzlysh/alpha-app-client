export interface Doctor {
  uuid: string;
  name: string;
  licenseNumber: string | null;
  specialty: string | null;
  clinicName: string | null;
  phone: string | null;
  status: "ACTIVE" | "INACTIVE";
  user: { uuid: string; name: string; email: string } | null;
  createdAt: string;
  updatedAt: string;
}

export interface DoctorListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: "ACTIVE" | "INACTIVE";
  sortBy?: "name" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
}

export interface CreateDoctorPayload {
  name: string;
  licenseNumber?: string;
  specialty?: string;
  clinicName?: string;
  phone?: string;
  userUuid?: string;
}

export interface UpdateDoctorPayload {
  name?: string;
  licenseNumber?: string | null;
  specialty?: string | null;
  clinicName?: string | null;
  phone?: string | null;
  status?: "ACTIVE" | "INACTIVE";
}

export interface DoctorDropdownItem {
  uuid: string;
  name: string;
  licenseNumber: string | null;
  clinicName: string | null;
}

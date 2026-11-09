export type PartyType = "PATIENT" | "PROFESSIONAL";
export type Gender = "MALE" | "FEMALE";

export interface PatientDetail {
  nik: string | null;
  gender: Gender | null;
  dateOfBirth: string | null;
  bpjsNumber: string | null;
  medicalRecordNumber: string | null;
}

export interface ProfessionalDetail {
  strNumber: string | null;
  sipNumber: string | null;
  profession: string | null;
}

export interface Patient {
  uuid: string;
  partyType: PartyType;
  name: string;
  phone: string | null;
  address: string | null;
  description: string | null;
  isWalkIn: boolean;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
  patientDetail: PatientDetail | null;
  professionalDetail: ProfessionalDetail | null;
}

export interface PatientListParams {
  page?: number;
  limit?: number;
  search?: string;
  partyType?: PartyType;
  status?: "ACTIVE" | "INACTIVE";
  isWalkIn?: boolean;
}

export interface CreatePatientPayload {
  partyType: PartyType;
  name: string;
  phone?: string;
  address?: string;
  description?: string;
  patientDetail?: {
    nik?: string;
    gender?: Gender;
    dateOfBirth?: string;
    bpjsNumber?: string;
    medicalRecordNumber?: string;
  };
  professionalDetail?: {
    strNumber?: string;
    sipNumber?: string;
    profession?: string;
  };
}

export interface UpdatePatientPayload {
  name?: string;
  phone?: string;
  address?: string;
  description?: string;
  status?: "ACTIVE" | "INACTIVE";
  patientDetail?: {
    nik?: string;
    gender?: Gender;
    dateOfBirth?: string;
    bpjsNumber?: string;
    medicalRecordNumber?: string;
  };
  professionalDetail?: {
    strNumber?: string;
    sipNumber?: string;
    profession?: string;
  };
}

export interface PatientDropdownItem {
  uuid: string;
  name: string;
  phone: string | null;
  partyType: PartyType;
  isWalkIn: boolean;
}

export interface PatientDropdownParams {
  search?: string;
  partyType?: PartyType;
}

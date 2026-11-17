import { axiosInstance } from "@/configs/axiosInstance";
import type { ApiResponse } from "@/types/api";
import type {
  AllergyConflict,
  CompleteExamPayload,
  ExamFieldsPayload,
  ExamPrescriptionItem,
  Examination,
  ExaminationQueue,
  VisitStatus,
  VitalsPayload,
} from "@/types/examination";

export async function getExaminationQueue(params?: { date?: string; status?: VisitStatus }): Promise<ApiResponse<ExaminationQueue>> {
  const res = await axiosInstance.get<ApiResponse<ExaminationQueue>>("/examinations", { params });
  return res.data;
}

export async function getExamination(uuid: string): Promise<ApiResponse<Examination>> {
  const res = await axiosInstance.get<ApiResponse<Examination>>(`/examinations/${uuid}`);
  return res.data;
}

export async function checkInPatient(payload: {
  customerUuid: string;
  doctorUuid?: string;
  chiefComplaint?: string;
}): Promise<ApiResponse<Examination>> {
  const res = await axiosInstance.post<ApiResponse<Examination>>("/examinations", payload);
  return res.data;
}

export async function triageExamination(uuid: string, payload: VitalsPayload): Promise<ApiResponse<Examination>> {
  const res = await axiosInstance.put<ApiResponse<Examination>>(`/examinations/${uuid}/triage`, payload);
  return res.data;
}

export async function startExamination(uuid: string, doctorUuid?: string): Promise<ApiResponse<Examination>> {
  const res = await axiosInstance.post<ApiResponse<Examination>>(`/examinations/${uuid}/start`, doctorUuid ? { doctorUuid } : {});
  return res.data;
}

export async function saveExamination(uuid: string, payload: ExamFieldsPayload): Promise<ApiResponse<Examination>> {
  const res = await axiosInstance.put<ApiResponse<Examination>>(`/examinations/${uuid}`, payload);
  return res.data;
}

export async function checkExamAllergies(uuid: string, items: Pick<ExamPrescriptionItem, "medicineUuid" | "medicineName">[]): Promise<ApiResponse<AllergyConflict[]>> {
  const res = await axiosInstance.post<ApiResponse<AllergyConflict[]>>(`/examinations/${uuid}/allergy-check`, { items });
  return res.data;
}

export async function completeExamination(uuid: string, payload: CompleteExamPayload): Promise<ApiResponse<Examination>> {
  const res = await axiosInstance.post<ApiResponse<Examination>>(`/examinations/${uuid}/complete`, payload);
  return res.data;
}

export async function cancelExamination(uuid: string, reason?: string): Promise<ApiResponse<Examination>> {
  const res = await axiosInstance.post<ApiResponse<Examination>>(`/examinations/${uuid}/cancel`, reason ? { reason } : {});
  return res.data;
}

import { axiosInstance } from "@/configs/axiosInstance";
import type { ApiResponse } from "@/types/api";
import type { BackgroundJob, JobRun, JobRunListParams, JobRunOutcome, UpdateJobSettingsPayload } from "@/types/job";

/** A run can take a while (it waits for the job to finish). */
const RUN_TIMEOUT_MS = 5 * 60 * 1000;

export async function getJobs(): Promise<ApiResponse<BackgroundJob[]>> {
  const response = await axiosInstance.get<ApiResponse<BackgroundJob[]>>("/jobs");
  return response.data;
}

export async function getJobRuns(params?: JobRunListParams): Promise<ApiResponse<JobRun[]>> {
  const response = await axiosInstance.get<ApiResponse<JobRun[]>>("/jobs/runs", { params });
  return response.data;
}

export async function runJob(name: string): Promise<ApiResponse<JobRunOutcome>> {
  const response = await axiosInstance.post<ApiResponse<JobRunOutcome>>(`/jobs/${name}/run`, undefined, {
    timeout: RUN_TIMEOUT_MS,
  });
  return response.data;
}

export async function updateJobSettings(name: string, payload: UpdateJobSettingsPayload): Promise<ApiResponse<BackgroundJob>> {
  const response = await axiosInstance.put<ApiResponse<BackgroundJob>>(`/jobs/${name}/settings`, payload);
  return response.data;
}

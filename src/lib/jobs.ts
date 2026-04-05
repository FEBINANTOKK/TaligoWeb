import {
  fetchProtected,
  postProtected,
  putProtected,
  deleteProtected,
} from "./api";

export interface Job {
  _id: string;
  title: string;
  description: string;
  location?: string;
  salary?: string;
  company?: string;
  tags?: string[];
  status?: "ACTIVE" | "DRAFT" | "COMPLETED";
  createdAt?: string;
  organizationId?: string;
  createdBy?: string;
}

export interface JobFormData {
  title: string;
  description: string;
  tags?: string[];
}

// The backend may return { data: [...] } or bare arrays — unwrap either shape.
type ApiResponse<T> = { data?: T } | T;

function unwrap<T>(res: ApiResponse<T>): T {
  if (
    res !== null &&
    typeof res === "object" &&
    !Array.isArray(res) &&
    "data" in (res as object)
  ) {
    return (res as { data: T }).data;
  }
  return res as T;
}

export async function getJobs(): Promise<Job[]> {
  const res = await fetchProtected<ApiResponse<Job[]>>("/api/jobs");
  return unwrap(res) ?? [];
}

export async function getJobById(id: string): Promise<Job> {
  const res = await fetchProtected<ApiResponse<Job>>(`/api/jobs/${id}`);
  return unwrap(res);
}

export async function getOrgJobs(orgId: string): Promise<Job[]> {
  const res = await fetchProtected<ApiResponse<Job[]>>(
    `/api/jobs/organization/${orgId}`,
  );
  return unwrap(res) ?? [];
}

export async function createJob(data: JobFormData): Promise<Job> {
  const res = await postProtected<ApiResponse<Job>>(
    "/api/jobs",
    data as unknown as Record<string, unknown>,
  );
  return unwrap(res);
}

export async function updateJob(id: string, data: JobFormData): Promise<Job> {
  const res = await putProtected<ApiResponse<Job>>(
    `/api/jobs/${id}`,
    data as unknown as Record<string, unknown>,
  );
  return unwrap(res);
}

export async function deleteJob(id: string): Promise<void> {
  await deleteProtected<unknown>(`/api/jobs/${id}`);
}

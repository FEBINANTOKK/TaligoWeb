import {
  fetchProtected,
  postProtected,
  putProtected,
  patchProtected,
  deleteProtected,
} from "./api";

export type JobStatus = "ACTIVE" | "DRAFT" | "CLOSED";

export type JobType =
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACT"
  | "INTERNSHIP"
  | "FREELANCE";

export type WorkMode = "ONSITE" | "REMOTE" | "HYBRID";

export interface Job {
  _id: string;
  id?: string;
  title: string;
  description: string;
  location?: string;
  jobType?: JobType;
  workMode?: WorkMode;
  skills?: string[];
  company?: string;
  tags?: string[];
  status?: JobStatus;
  createdAt?: string;
  updatedAt?: string;
  organizationId?: string;
  createdBy?: string;
}

export interface CreateJobData {
  title: string;
  description: string;
  location?: string;
  jobType?: JobType;
  workMode?: WorkMode;
  skills?: string[];
  status?: JobStatus;
}

export type UpdateJobData = Partial<CreateJobData>;

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

function normalizeJob(job: Job): Job {
  const normalizedSkills =
    Array.isArray(job.skills) && job.skills.length > 0
      ? job.skills
      : Array.isArray(job.tags)
        ? job.tags
        : [];

  const normalizedStatus =
    job.status === "ACTIVE" || job.status === "DRAFT" || job.status === "CLOSED"
      ? job.status
      : "DRAFT";

  return {
    ...job,
    _id: job._id ?? job.id ?? "",
    skills: normalizedSkills,
    tags: normalizedSkills,
    status: normalizedStatus,
  };
}

export async function getJobs(): Promise<Job[]> {
  const res = await fetchProtected<ApiResponse<Job[]>>("/api/jobs");
  const jobs = unwrap(res) ?? [];
  return jobs.map(normalizeJob);
}

export async function getJobById(id: string): Promise<Job> {
  const res = await fetchProtected<ApiResponse<Job>>(`/api/jobs/${id}`);
  return normalizeJob(unwrap(res));
}

export async function getOrgJobs(orgId: string): Promise<Job[]> {
  const res = await fetchProtected<ApiResponse<Job[]>>(
    `/api/jobs/organization/${orgId}`,
  );
  const jobs = unwrap(res) ?? [];
  return jobs.map(normalizeJob);
}

export async function getMyJobs(): Promise<Job[]> {
  const res = await fetchProtected<ApiResponse<Job[]>>("/api/jobs/my");
  const jobs = unwrap(res) ?? [];
  return jobs.map(normalizeJob);
}

export async function createJob(data: CreateJobData): Promise<Job> {
  const res = await postProtected<ApiResponse<Job>>(
    "/api/jobs",
    data as unknown as Record<string, unknown>,
  );
  return normalizeJob(unwrap(res));
}

export async function updateJob(id: string, data: UpdateJobData): Promise<Job> {
  const res = await putProtected<ApiResponse<Job>>(
    `/api/jobs/${id}`,
    data as unknown as Record<string, unknown>,
  );
  return normalizeJob(unwrap(res));
}

export async function updateJobStatus(
  id: string,
  status: JobStatus,
): Promise<Job> {
  const res = await patchProtected<ApiResponse<Job>>(`/api/jobs/${id}/status`, {
    status,
  });
  return normalizeJob(unwrap(res));
}

export async function deleteJob(id: string): Promise<void> {
  await deleteProtected<unknown>(`/api/jobs/${id}`);
}

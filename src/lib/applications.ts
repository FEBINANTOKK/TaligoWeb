import { fetchProtected, postProtected } from "./api";

export type ApplicationStatus = "applied" | "shortlisted" | "rejected";

export interface ApplicationJob {
  _id?: string;
  title?: string;
  location?: string;
  jobType?: string;
  workMode?: string;
}

export interface ApplicationUser {
  _id?: string;
  name?: string;
  email?: string;
}

export interface ApplicationItem {
  _id: string;
  id?: string;
  jobId?: string | ApplicationJob;
  userId?: string | ApplicationUser;
  job?: ApplicationJob;
  candidate?: ApplicationUser;
  status?: ApplicationStatus | string;
  createdAt?: string;
}

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

function normalizeApplication(item: ApplicationItem): ApplicationItem {
  const jobFromJobId =
    item.jobId && typeof item.jobId === "object" ? item.jobId : undefined;
  const candidateFromUserId =
    item.userId && typeof item.userId === "object" ? item.userId : undefined;

  return {
    ...item,
    _id: item._id ?? item.id ?? "",
    job: item.job ?? jobFromJobId,
    candidate: item.candidate ?? candidateFromUserId,
  };
}

export async function applyToJob(jobId: string): Promise<void> {
  await postProtected<unknown>("/api/applications", { jobId });
}

export async function getMyApplications(): Promise<ApplicationItem[]> {
  const res = await fetchProtected<ApiResponse<ApplicationItem[]>>(
    "/api/applications/my",
  );
  return (unwrap(res) ?? []).map(normalizeApplication);
}

export async function getJobApplications(
  jobId: string,
): Promise<ApplicationItem[]> {
  const res = await fetchProtected<ApiResponse<ApplicationItem[]>>(
    `/api/jobs/${jobId}/applications`,
  );
  return (unwrap(res) ?? []).map(normalizeApplication);
}

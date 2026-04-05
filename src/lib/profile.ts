import { API_BASE } from "@/lib/api";

export interface ProfileExperience {
  _id?: string;
  company: string;
  role: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

export interface ProfileEducation {
  _id?: string;
  institution: string;
  degree: string;
  field?: string;
  graduationYear?: number;
}

export interface ProfileLinks {
  github?: string;
  linkedin?: string;
  portfolio?: string;
}

export interface CandidateProfile {
  _id: string;
  userId: string;

  // Basic Info
  name: string;
  location?: string;
  phone?: string;

  // Professional
  headline?: string;
  summary?: string;
  experienceYears?: number;

  // Skills
  skills?: string[];

  // Experience & Education
  experience?: ProfileExperience[];
  education?: ProfileEducation[];

  // Links
  links?: ProfileLinks;

  // Preferences
  jobType?: string[];
  workMode?: string[];

  // Resume
  resume?: {
    url: string;
    filename: string;
  };

  createdAt: string;
  updatedAt: string;
}

export type EmployerRole = "RECRUITER" | "ORG_ADMIN";

export interface EmployerProfile {
  _id: string;
  userId: string;
  role: EmployerRole;
  name: string;
  phone?: string;
  location?: string;
  jobTitle?: string;
  organizationId?: string;
  organizationName?: string;
  department?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  websiteUrl?: string;
  skills?: string[];
  isVerified?: boolean;
  createdAt: string;
  updatedAt: string;
}

async function parseErrorResponse(res: Response): Promise<string> {
  const fallback = `API error: ${res.status} ${res.statusText}`;

  try {
    const contentType = res.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      const data = (await res.json()) as {
        message?: string;
        error?: string;
      };
      return data.message ?? data.error ?? fallback;
    }

    const text = await res.text();
    return text || fallback;
  } catch {
    return fallback;
  }
}

/**
 * Fetch candidate profile
 */
export async function getProfile(): Promise<CandidateProfile | null> {
  try {
    const res = await fetch(`${API_BASE}/api/profile`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      if (res.status === 404) {
        return null;
      }
      throw new Error(await parseErrorResponse(res));
    }

    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      return null;
    }

    const data = (await res.json()) as { data?: CandidateProfile };
    return data.data ?? null;
  } catch (error) {
    throw error;
  }
}

/**
 * Create new candidate profile
 */
export async function createProfile(
  data: Partial<CandidateProfile>,
): Promise<CandidateProfile> {
  const res = await fetch(`${API_BASE}/api/profile`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(await parseErrorResponse(res));
  }

  const contentType = res.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    throw new Error("Invalid response from server");
  }

  const responseData = (await res.json()) as { data?: CandidateProfile };
  if (!responseData.data) {
    throw new Error("Invalid response from server");
  }

  return responseData.data;
}

/**
 * Update candidate profile
 */
export async function updateProfile(
  data: Partial<CandidateProfile>,
): Promise<CandidateProfile> {
  const res = await fetch(`${API_BASE}/api/profile`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(await parseErrorResponse(res));
  }

  const contentType = res.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    throw new Error("Invalid response from server");
  }

  const responseData = (await res.json()) as { data?: CandidateProfile };
  if (!responseData.data) {
    throw new Error("Invalid response from server");
  }

  return responseData.data;
}

/**
 * Fetch employer profile for recruiter/orgadmin
 */
export async function getEmployerProfile(): Promise<EmployerProfile | null> {
  const res = await fetch(`${API_BASE}/api/employer-profile`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    if (res.status === 404) {
      return null;
    }
    throw new Error(await parseErrorResponse(res));
  }

  const contentType = res.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return null;
  }

  const data = (await res.json()) as { data?: EmployerProfile };
  return data.data ?? null;
}

/**
 * Create employer profile for recruiter/orgadmin
 */
export async function createEmployerProfile(
  data: Partial<EmployerProfile>,
): Promise<EmployerProfile> {
  const res = await fetch(`${API_BASE}/api/employer-profile`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(await parseErrorResponse(res));
  }

  const contentType = res.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    throw new Error("Invalid response from server");
  }

  const responseData = (await res.json()) as { data?: EmployerProfile };
  if (!responseData.data) {
    throw new Error("Invalid response from server");
  }

  return responseData.data;
}

/**
 * Update employer profile for recruiter/orgadmin
 */
export async function updateEmployerProfile(
  data: Partial<EmployerProfile>,
): Promise<EmployerProfile> {
  const res = await fetch(`${API_BASE}/api/employer-profile`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(await parseErrorResponse(res));
  }

  const contentType = res.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    throw new Error("Invalid response from server");
  }

  const responseData = (await res.json()) as { data?: EmployerProfile };
  if (!responseData.data) {
    throw new Error("Invalid response from server");
  }

  return responseData.data;
}

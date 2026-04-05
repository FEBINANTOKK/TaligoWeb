import { API_BASE } from "@/lib/api";

export type UserRole = "candidate" | "recruiter" | "orgadmin" | "superadmin";

function isUserRole(value: unknown): value is UserRole {
  return (
    value === "candidate" ||
    value === "recruiter" ||
    value === "superadmin" ||
    value == "orgadmin"
  );
}

export async function getUserRole(): Promise<UserRole | null> {
  try {
    const res = await fetch(`${API_BASE}/api/user/me`, {
      credentials: "include",
    });

    if (!res.ok) {
      return null;
    }

    const data = (await res.json()) as {
      data?: { role?: unknown };
    };

    const role = data?.data?.role;
    return isUserRole(role) ? role : null;
  } catch {
    return null;
  }
}

export function getDashboardPathForRole(role: UserRole): string {
  switch (role) {
    case "candidate":
      return "/dashboard/candidate";
    case "superadmin":
      return "/dashboard/superadmin";
    case "recruiter":
    case "orgadmin":
      return "/dashboard/recruiter";
    default:
      return "/dashboard";
  }
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Briefcase, Loader2, Users } from "lucide-react";
import { getJobApplications, type ApplicationItem } from "@/lib/applications";
import { getUserRole, type UserRole } from "@/lib/user-role";

function formatDate(value?: string) {
  if (!value) {
    return "Unknown";
  }
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export default function JobApplicationsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadRoleAndData = async () => {
      setLoading(true);
      setError(null);

      try {
        const role = await getUserRole();
        if (cancelled) {
          return;
        }

        setUserRole(role);

        const allowed =
          role === "recruiter" || role === "orgadmin" || role === "superadmin";

        if (!allowed) {
          router.replace("/jobs");
          return;
        }

        const rows = await getJobApplications(id);

        if (!cancelled) {
          setApplications(rows);
        }
      } catch (e: unknown) {
        if (!cancelled) {
          setError(
            e instanceof Error ? e.message : "Failed to load applications",
          );
          setApplications([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadRoleAndData();

    return () => {
      cancelled = true;
    };
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const allowed =
    userRole === "recruiter" ||
    userRole === "orgadmin" ||
    userRole === "superadmin";
  if (!allowed) {
    return null;
  }

  return (
    <div className="space-y-6">
      <Link
        href={`/jobs/${id}`}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Job
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-foreground">Job Applications</h1>
        <p className="text-sm text-muted-foreground">
          Candidates who applied for this role
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      {!error && applications.length === 0 && (
        <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-border bg-card text-center">
          <Briefcase className="mb-3 h-10 w-10 text-muted-foreground" />
          <p className="font-semibold text-foreground">No applicants yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            This job has not received applications yet.
          </p>
        </div>
      )}

      {!error && applications.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-175 text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-4 py-3 text-left font-semibold text-foreground">
                    Candidate Name
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">
                    Applied Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {applications.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-accent/40 transition-colors"
                  >
                    <td className="px-4 py-3 text-foreground font-medium">
                      <span className="inline-flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        {item.candidate?.name ?? "Unknown candidate"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {item.candidate?.email ?? "Unknown"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDate(item.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

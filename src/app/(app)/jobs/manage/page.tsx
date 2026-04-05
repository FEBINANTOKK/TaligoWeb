"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Briefcase,
  Loader2,
  AlertCircle,
  Pencil,
  Trash2,
  Plus,
} from "lucide-react";
import { API_BASE } from "@/lib/api";
import {
  deleteJob,
  getJobs,
  getOrgJobs,
  updateJobStatus,
  type Job,
  type JobStatus,
} from "@/lib/jobs";
import { AbilityContext } from "@/providers/AbilityProvider";

type ToastState = {
  type: "success" | "error";
  message: string;
} | null;

function getStatusClass(status?: JobStatus) {
  if (status === "ACTIVE") {
    return "border border-green-200 bg-green-100 text-green-700";
  }
  if (status === "CLOSED") {
    return "border border-red-200 bg-red-100 text-red-700";
  }
  return "border border-zinc-200 bg-zinc-100 text-zinc-700";
}

export default function ManageJobsPage() {
  const router = useRouter();
  const ability = useContext(AbilityContext);

  const canManage =
    ability.can("MANAGE", "OrgJob") ||
    ability.can("UPDATE", "OrgJob") ||
    ability.can("DELETE", "OrgJob");
  const canUpdate =
    ability.can("UPDATE", "Job") ||
    ability.can("UPDATE", "OrgJob") ||
    ability.can("MANAGE", "OrgJob");
  const canDelete =
    ability.can("DELETE", "Job") ||
    ability.can("DELETE", "OrgJob") ||
    ability.can("MANAGE", "OrgJob");

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState>(null);

  useEffect(() => {
    if (!canManage) {
      const hasInitializedAbility =
        ability.can("READ", "Profile") || ability.can("READ", "Settings");

      if (hasInitializedAbility) {
        router.replace("/jobs");
      }
      return;
    }

    let cancelled = false;

    const loadJobs = async () => {
      setLoading(true);
      setError(null);

      try {
        const profileRes = await fetch(`${API_BASE}/api/user/me`, {
          credentials: "include",
        });

        if (!profileRes.ok) {
          throw new Error("Could not fetch user profile");
        }

        const profileData = (await profileRes.json()) as {
          data?: { organizationId?: string };
        };

        const orgId = profileData?.data?.organizationId;
        const nextJobs = orgId ? await getOrgJobs(orgId) : await getJobs();

        if (!cancelled) {
          setJobs(nextJobs);
        }
      } catch (e: unknown) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load jobs");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadJobs();

    return () => {
      cancelled = true;
    };
  }, [ability, canManage, router]);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timer = window.setTimeout(() => setToast(null), 2400);
    return () => window.clearTimeout(timer);
  }, [toast]);

  async function handleDelete(jobId: string) {
    if (!canDelete) {
      return;
    }

    if (!confirm("Delete this job?")) {
      return;
    }

    setDeletingId(jobId);

    try {
      await deleteJob(jobId);
      setJobs((prev) => prev.filter((job) => job._id !== jobId));
      setToast({ type: "success", message: "Job deleted" });
    } catch (e: unknown) {
      setToast({
        type: "error",
        message: e instanceof Error ? e.message : "Failed to delete job",
      });
    } finally {
      setDeletingId(null);
    }
  }

  async function handleStatusChange(jobId: string, status: JobStatus) {
    if (!canUpdate) {
      return;
    }

    const current = jobs.find((job) => job._id === jobId);
    if (!current || current.status === status) {
      return;
    }

    const previousStatus = current.status;

    setUpdatingId(jobId);
    setJobs((prev) =>
      prev.map((job) => (job._id === jobId ? { ...job, status } : job)),
    );

    try {
      await updateJobStatus(jobId, status);
      setToast({ type: "success", message: "Status changed" });
    } catch (e: unknown) {
      setJobs((prev) =>
        prev.map((job) =>
          job._id === jobId ? { ...job, status: previousStatus } : job,
        ),
      );
      setToast({
        type: "error",
        message: e instanceof Error ? e.message : "Failed to change status",
      });
    } finally {
      setUpdatingId(null);
    }
  }

  if (!canManage) {
    return null;
  }

  return (
    <div className="space-y-6">
      {toast && (
        <div
          className={`rounded-lg border px-4 py-2 text-sm ${
            toast.type === "success"
              ? "border-green-200 bg-green-100 text-green-700"
              : "border-red-200 bg-red-100 text-red-700"
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Organization Jobs
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your job postings and statuses
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
          >
            <Briefcase className="h-4 w-4" />
            Jobs
          </Link>
          <Link
            href="/jobs/create"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Create Job
          </Link>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        {loading && (
          <div className="flex min-h-64 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {!loading && error && (
          <div className="flex min-h-64 flex-col items-center justify-center gap-3">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {!loading && !error && jobs.length === 0 && (
          <div className="flex min-h-64 flex-col items-center justify-center text-center">
            <Briefcase className="mb-3 h-10 w-10 text-muted-foreground" />
            <p className="font-semibold text-foreground">No jobs yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Create your first job posting to start hiring.
            </p>
          </div>
        )}

        {!loading && !error && jobs.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-225 text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-4 py-3 text-left font-semibold text-foreground">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">
                    Location
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">
                    Date
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {jobs.map((job) => (
                  <tr
                    key={job._id}
                    className="transition-colors hover:bg-accent/40"
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-foreground">
                          {job.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {job.jobType ?? "FULL_TIME"} |{" "}
                          {job.workMode ?? "ONSITE"}
                        </p>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusClass(job.status)}`}
                        >
                          {job.status ?? "DRAFT"}
                        </span>

                        {canUpdate && (
                          <select
                            value={job.status ?? "DRAFT"}
                            disabled={updatingId === job._id}
                            onChange={(e) =>
                              handleStatusChange(
                                job._id,
                                e.target.value as JobStatus,
                              )
                            }
                            className="rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                          >
                            <option value="ACTIVE">ACTIVE</option>
                            <option value="DRAFT">DRAFT</option>
                            <option value="CLOSED">CLOSED</option>
                          </select>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3 text-muted-foreground">
                      {job.location || "Not specified"}
                    </td>

                    <td className="px-4 py-3 text-muted-foreground">
                      {job.createdAt
                        ? new Intl.DateTimeFormat("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }).format(new Date(job.createdAt))
                        : "Unknown"}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {canUpdate && (
                          <Link
                            href={`/jobs/edit/${job._id}`}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-accent"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </Link>
                        )}

                        {canDelete && (
                          <button
                            type="button"
                            onClick={() => handleDelete(job._id)}
                            disabled={deletingId === job._id}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700 transition-colors hover:bg-red-200 disabled:opacity-60"
                          >
                            {deletingId === job._id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="h-3.5 w-3.5" />
                            )}
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

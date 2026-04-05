"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Plus,
  Pencil,
  Trash2,
  Briefcase,
  Loader2,
  AlertCircle,
  BarChart3,
  Users,
  CheckCircle2,
} from "lucide-react";
import { API_BASE } from "@/lib/api";
import { getOrgJobs, deleteJob, type Job } from "@/lib/jobs";
import { AbilityContext } from "@/providers/AbilityProvider";

type StatusBadgeProps = { status?: string };

function StatusBadge({ status }: StatusBadgeProps) {
  const map: Record<string, string> = {
    ACTIVE: "job-status-active",
    DRAFT: "job-status-draft",
    COMPLETED: "job-status-complete",
  };
  const label = status ?? "DRAFT";
  return (
    <span
      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${map[label] ?? map.DRAFT}`}
    >
      {label}
    </span>
  );
}

export default function ManageJobsPage() {
  const router = useRouter();
  const ability = useContext(AbilityContext);

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const canManage = ability.can("MANAGE", "OrgJob");

  // Fetch org data then org jobs
  useEffect(() => {
    const hasAnyAbility =
      ability.can("READ", "Profile") || ability.can("READ", "Settings");
    if (hasAnyAbility && !canManage) {
      router.replace("/jobs");
      return;
    }

    const loadJobs = async () => {
      try {
        // Get orgId from user profile
        const profileRes = await fetch(`${API_BASE}/api/user/me`, {
          credentials: "include",
        });
        if (!profileRes.ok) throw new Error("Could not fetch user profile");
        const profileData = (await profileRes.json()) as {
          data?: { organizationId?: string };
        };
        const orgId = profileData?.data?.organizationId;

        if (!orgId) {
          // Fall back to all accessible jobs when orgId is unavailable
          const { getJobs } = await import("@/lib/jobs");
          const all = await getJobs();
          setJobs(all);
        } else {
          const orgJobs = await getOrgJobs(orgId);
          setJobs(orgJobs);
        }
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };

    void loadJobs();
  }, [canManage, ability, router]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this job posting?")) return;
    setDeletingId(id);
    try {
      await deleteJob(id);
      setJobs((prev) => prev.filter((j) => j.id !== id));
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setDeletingId(null);
    }
  }

  const active = jobs.filter((j) => j.status === "ACTIVE").length;
  const draft = jobs.filter((j) => j.status === "DRAFT").length;

  if (!canManage) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage Jobs</h1>
          <p className="text-sm text-muted-foreground">
            Your organization's job postings
          </p>
        </div>
        <Link
          href="/jobs/create"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Post New Job
        </Link>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Total Jobs",
            value: jobs.length,
            icon: Briefcase,
            color: "text-primary",
          },
          {
            label: "Active",
            value: active,
            icon: CheckCircle2,
            color: "text-primary",
          },
          {
            label: "Draft",
            value: draft,
            icon: BarChart3,
            color: "text-secondary-foreground",
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="p-5 rounded-xl border border-border bg-card shadow-sm flex items-center gap-4"
          >
            <div
              className={`w-10 h-10 rounded-lg bg-accent flex items-center justify-center ${color}`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        {loading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <AlertCircle className="w-8 h-8 job-danger-text" />
            <p className="job-danger-text text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && jobs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Briefcase className="w-10 h-10 text-muted-foreground mb-3" />
            <p className="font-semibold text-foreground">No jobs yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Post your first job to start receiving applications.
            </p>
            <Link
              href="/jobs/create"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" /> Post Job
            </Link>
          </div>
        )}

        {!loading && !error && jobs.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-4 py-3 text-left font-semibold text-foreground">
                    Job Title
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground hidden sm:table-cell">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground hidden md:table-cell">
                    Posted
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
                    className="hover:bg-accent/40 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-accent flex items-center justify-center shrink-0">
                          <Briefcase className="w-4 h-4 text-accent-foreground" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-foreground truncate max-w-[200px]">
                            {job.title}
                          </p>
                          {job.tags && job.tags.length > 0 && (
                            <p className="text-xs text-muted-foreground truncate">
                              {job.tags.slice(0, 3).join(", ")}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <StatusBadge status={job.status} />
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell whitespace-nowrap">
                      {job.createdAt
                        ? new Intl.DateTimeFormat("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }).format(new Date(job.createdAt))
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/jobs/edit/${job._id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-accent transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" /> Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(job._id)}
                          disabled={deletingId === job._id}
                          className="job-danger-button inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 cursor-pointer"
                        >
                          {deletingId === job._id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                          Delete
                        </button>
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

"use client";

import { useContext, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  Pencil,
  Trash2,
  MapPin,
  Building2,
  Workflow,
  Send,
  Users,
} from "lucide-react";
import {
  deleteJob,
  getJobById,
  updateJobStatus,
  type Job,
  type JobStatus,
} from "@/lib/jobs";
import { applyToJob } from "@/lib/applications";
import { getUserRole, type UserRole } from "@/lib/user-role";
import { AbilityContext } from "@/providers/AbilityProvider";

type ToastState = {
  type: "success" | "error";
  message: string;
} | null;

const STATUS_OPTIONS: JobStatus[] = ["ACTIVE", "DRAFT", "CLOSED"];

function getStatusClass(status?: JobStatus) {
  if (status === "ACTIVE") {
    return "border border-green-200 bg-green-100 text-green-700";
  }
  if (status === "CLOSED") {
    return "border border-red-200 bg-red-100 text-red-700";
  }
  return "border border-zinc-200 bg-zinc-100 text-zinc-700";
}

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const ability = useContext(AbilityContext);

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [toast, setToast] = useState<ToastState>(null);

  const canUpdate =
    ability.can("UPDATE", "Job") ||
    ability.can("UPDATE", "OrgJob") ||
    ability.can("MANAGE", "OrgJob");
  const canDelete =
    ability.can("DELETE", "Job") ||
    ability.can("DELETE", "OrgJob") ||
    ability.can("MANAGE", "OrgJob");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getJobById(id);
        if (!cancelled) {
          setJob(data);
        }
      } catch (e: unknown) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load job");
          setJob(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    let cancelled = false;

    const loadRole = async () => {
      const role = await getUserRole();
      if (!cancelled) {
        setUserRole(role);
      }
    };

    void loadRole();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timer = window.setTimeout(() => setToast(null), 2400);
    return () => window.clearTimeout(timer);
  }, [toast]);

  async function handleDelete() {
    if (!job) {
      return;
    }

    if (!confirm("Are you sure you want to delete this job?")) {
      return;
    }

    setDeleting(true);
    try {
      await deleteJob(job._id);
      setToast({ type: "success", message: "Job deleted" });
      router.replace("/jobs");
    } catch (e: unknown) {
      setToast({
        type: "error",
        message: e instanceof Error ? e.message : "Failed to delete job",
      });
      setDeleting(false);
    }
  }

  async function handleStatusChange(nextStatus: JobStatus) {
    if (!job || statusUpdating || job.status === nextStatus) {
      return;
    }

    const previousStatus = job.status;

    setStatusUpdating(true);
    setJob((prev) => (prev ? { ...prev, status: nextStatus } : prev));

    try {
      await updateJobStatus(job._id, nextStatus);
      const fresh = await getJobById(job._id);
      setJob(fresh);
      setToast({ type: "success", message: "Status changed" });
    } catch (e: unknown) {
      setJob((prev) => (prev ? { ...prev, status: previousStatus } : prev));
      setToast({
        type: "error",
        message: e instanceof Error ? e.message : "Failed to change status",
      });
    } finally {
      setStatusUpdating(false);
    }
  }

  async function handleApply() {
    if (!job || applying || applied) {
      return;
    }

    setApplying(true);

    try {
      await applyToJob(job._id);
      setApplied(true);
      setToast({ type: "success", message: "Applied successfully" });
      router.replace("/applications");
    } catch (e: unknown) {
      setToast({
        type: "error",
        message: e instanceof Error ? e.message : "Failed to apply",
      });
      setApplying(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center gap-3 text-center">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <p className="font-semibold text-foreground">
          {error ?? "Job not found"}
        </p>
        <Link
          href="/jobs"
          className="text-sm font-semibold text-primary hover:underline"
        >
          Back to Jobs
        </Link>
      </div>
    );
  }

  const skills = job.skills ?? job.tags ?? [];
  const canApply = userRole === "candidate";
  const canViewApplications =
    userRole === "recruiter" ||
    userRole === "orgadmin" ||
    userRole === "superadmin";

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

      <Link
        href="/jobs"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Jobs
      </Link>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">{job.title}</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              {job.location && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {job.location}
                </span>
              )}
              {job.jobType && (
                <span className="inline-flex items-center gap-1.5">
                  <Building2 className="h-4 w-4" />
                  {job.jobType}
                </span>
              )}
              {job.workMode && (
                <span className="inline-flex items-center gap-1.5">
                  <Workflow className="h-4 w-4" />
                  {job.workMode}
                </span>
              )}
            </div>
          </div>

          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(job.status)}`}
          >
            {job.status ?? "DRAFT"}
          </span>
        </div>

        <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
          {job.description}
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          {canApply && (
            <button
              type="button"
              onClick={handleApply}
              disabled={applying || applied}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {applying ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {applied ? "Applied" : applying ? "Applying..." : "Apply"}
            </button>
          )}

          {canViewApplications && (
            <Link
              href={`/jobs/${job._id}/applications`}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
            >
              <Users className="h-4 w-4" />
              View Applications
            </Link>
          )}
        </div>
      </div>

      {skills.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-foreground">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {canUpdate && (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-foreground">
            Status Management
          </h2>
          <div className="flex flex-wrap gap-2">
            {STATUS_OPTIONS.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => handleStatusChange(status)}
                disabled={statusUpdating || job.status === status}
                className={`rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                  job.status === status
                    ? getStatusClass(status)
                    : "border border-border bg-background text-foreground hover:bg-accent"
                } disabled:cursor-not-allowed disabled:opacity-70`}
              >
                {statusUpdating && job.status === status
                  ? "Updating..."
                  : `Set ${status}`}
              </button>
            ))}
          </div>
        </div>
      )}

      {(canUpdate || canDelete) && (
        <div className="flex flex-wrap gap-3">
          {canUpdate && (
            <Link
              href={`/jobs/edit/${job._id}`}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
            >
              <Pencil className="h-4 w-4" />
              Edit
            </Link>
          )}

          {canDelete && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-100 px-4 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-200 disabled:opacity-60"
            >
              {deleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              {deleting ? "Deleting..." : "Delete"}
            </button>
          )}
        </div>
      )}

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-foreground">
          Full Details
        </h2>
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Title</dt>
            <dd className="font-medium text-foreground">{job.title}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Location</dt>
            <dd className="font-medium text-foreground">
              {job.location ?? "Not specified"}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Job Type</dt>
            <dd className="font-medium text-foreground">
              {job.jobType ?? "Not specified"}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Work Mode</dt>
            <dd className="font-medium text-foreground">
              {job.workMode ?? "Not specified"}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Status</dt>
            <dd className="font-medium text-foreground">
              {job.status ?? "DRAFT"}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Created</dt>
            <dd className="font-medium text-foreground">
              {job.createdAt
                ? new Intl.DateTimeFormat("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }).format(new Date(job.createdAt))
                : "Unknown"}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

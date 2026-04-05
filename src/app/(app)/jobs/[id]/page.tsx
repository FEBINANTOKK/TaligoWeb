"use client";

import { useEffect, useState, useContext } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  DollarSign,
  Briefcase,
  Pencil,
  Trash2,
  Bookmark,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { getJobById, deleteJob, type Job } from "@/lib/jobs";
import { Can, AbilityContext } from "@/providers/AbilityProvider";

const PLACEHOLDER_RESPONSIBILITIES = [
  "Design and implement scalable systems",
  "Collaborate with cross-functional teams",
  "Perform code reviews and mentor juniors",
  "Drive technical roadmap decisions",
];

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [applied, setApplied] = useState(false);

  const ability = useContext(AbilityContext);

  useEffect(() => {
    getJobById(id)
      .then(setJob)
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : "Failed to load job"),
      )
      .finally(() => setLoading(false));
  }, [id]);

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this job posting?")) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteJob(id);
      router.push("/jobs");
    } catch (e: unknown) {
      setDeleteError(e instanceof Error ? e.message : "Delete failed");
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3 text-center">
        <AlertCircle className="w-10 h-10 job-danger-text" />
        <p className="font-semibold text-foreground">
          {error ?? "Job not found"}
        </p>
        <Link href="/jobs" className="text-sm text-primary hover:underline">
          Back to listings
        </Link>
      </div>
    );
  }

  const canManage =
    ability.can("MANAGE", "OrgJob") || ability.can("UPDATE", "Job");

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link
        href="/jobs"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to listings
      </Link>

      {/* Two-column layout */}
      <div className="flex gap-6 items-start">
        {/* ── Left ── */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* Title block */}
          <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center shrink-0">
                  <Briefcase className="w-6 h-6 text-accent-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">
                    {job.title}
                  </h1>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {job.company ?? "Organization"}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                    {job.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {job.location}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      {job.salary ?? "Competitive"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status badge */}
              {job.status && (
                <span
                  className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${
                    job.status === "ACTIVE"
                      ? "job-status-active"
                      : job.status === "DRAFT"
                        ? "job-status-draft"
                        : "job-status-complete"
                  }`}
                >
                  {job.status}
                </span>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3">
              <Can I="CREATE" a="Application">
                {applied ? (
                  <span className="job-status-active inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold">
                    <CheckCircle2 className="w-4 h-4" /> Applied
                  </span>
                ) : (
                  <button
                    onClick={() => setApplied(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    Apply Now
                  </button>
                )}
              </Can>

              <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card text-foreground text-sm font-semibold hover:bg-accent transition-colors cursor-pointer">
                <Bookmark className="w-4 h-4" /> Save
              </button>

              {canManage && (
                <>
                  <Link
                    href={`/jobs/edit/${id}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card text-foreground text-sm font-semibold hover:bg-accent transition-colors"
                  >
                    <Pencil className="w-4 h-4" /> Edit
                  </Link>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="job-danger-button inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {deleting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                    {deleting ? "Deleting…" : "Delete"}
                  </button>
                </>
              )}
            </div>

            {deleteError && (
              <p className="job-danger-text mt-3 text-sm">{deleteError}</p>
            )}
          </div>

          {/* Opportunity */}
          <div className="p-6 rounded-xl border border-border bg-card shadow-sm space-y-3">
            <h2 className="text-base font-semibold text-foreground">
              Opportunity
            </h2>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
              {job.description}
            </p>
          </div>

          {/* Skills */}
          {job.tags && job.tags.length > 0 && (
            <div className="p-6 rounded-xl border border-border bg-card shadow-sm space-y-3">
              <h2 className="text-base font-semibold text-foreground">
                Required Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {job.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-sm px-3 py-1 rounded-full bg-secondary text-secondary-foreground font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Responsibilities */}
          <div className="p-6 rounded-xl border border-border bg-card shadow-sm space-y-3">
            <h2 className="text-base font-semibold text-foreground">
              Responsibilities
            </h2>
            <ul className="space-y-2">
              {PLACEHOLDER_RESPONSIBILITIES.map((r) => (
                <li
                  key={r}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Right sidebar ── */}
        <div className="hidden lg:flex flex-col w-72 shrink-0 gap-5">
          {/* Job Intelligence */}
          <div className="p-5 rounded-xl border border-border bg-card shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-foreground">
              Job Intelligence
            </h3>
            <div className="space-y-2.5 text-sm">
              {[
                { label: "Match Score", value: "87%" },
                { label: "Competition", value: "Medium" },
                { label: "Avg. Salary", value: job.salary ?? "$80k–$120k" },
                { label: "Remote", value: "Hybrid" },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-semibold text-foreground">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Apply panel */}
          <Can I="CREATE" a="Application">
            <div className="p-5 rounded-xl border border-border bg-card shadow-sm space-y-4">
              <h3 className="text-sm font-semibold text-foreground">
                Quick Apply
              </h3>
              <p className="text-xs text-muted-foreground">
                Your profile resume will be included with your application.
              </p>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted text-xs text-muted-foreground">
                <Briefcase className="w-4 h-4 shrink-0" />
                <span className="truncate">myresume.pdf</span>
              </div>
              {applied ? (
                <span className="flex items-center gap-2 text-sm text-primary font-semibold">
                  <CheckCircle2 className="w-4 h-4" /> Application Sent
                </span>
              ) : (
                <button
                  onClick={() => setApplied(true)}
                  className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Apply Now
                </button>
              )}
            </div>
          </Can>
        </div>
      </div>
    </div>
  );
}

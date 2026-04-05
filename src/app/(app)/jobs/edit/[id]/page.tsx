"use client";

import { useContext, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, X, Loader2, Eye, AlertCircle } from "lucide-react";
import { getJobById, updateJob, type Job } from "@/lib/jobs";
import { AbilityContext } from "@/providers/AbilityProvider";

const SUGGESTED_TAGS = [
  "React",
  "TypeScript",
  "Node.js",
  "Python",
  "AWS",
  "Docker",
  "PostgreSQL",
  "GraphQL",
  "Next.js",
  "Go",
];

export default function EditJobPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const ability = useContext(AbilityContext);

  const [loadingJob, setLoadingJob] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const canEdit =
    ability.can("MANAGE", "OrgJob") || ability.can("UPDATE", "OrgJob");

  // Prefill form from existing job
  useEffect(() => {
    getJobById(id)
      .then((job: Job) => {
        setTitle(job.title);
        setDescription(job.description);
        setTags(job.tags ?? []);
      })
      .catch((e: unknown) =>
        setLoadError(e instanceof Error ? e.message : "Failed to load job"),
      )
      .finally(() => setLoadingJob(false));
  }, [id]);

  // Redirect if not authorized
  useEffect(() => {
    const hasAnyAbility =
      ability.can("READ", "Profile") || ability.can("READ", "Settings");
    if (hasAnyAbility && !canEdit) {
      router.replace(`/jobs/${id}`);
    }
  }, [canEdit, ability, id, router]);

  function addTag(tag: string) {
    const t = tag.trim();
    if (t && !tags.includes(t)) setTags((prev) => [...prev, t]);
    setTagInput("");
  }

  function removeTag(tag: string) {
    setTags((prev) => prev.filter((t) => t !== tag));
  }

  function handleTagKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(tagInput);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setSubmitError("Title and description are required.");
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      await updateJob(id, {
        title: title.trim(),
        description: description.trim(),
        tags,
      });
      router.push(`/jobs/${id}`);
    } catch (err: unknown) {
      setSubmitError(
        err instanceof Error ? err.message : "Failed to update job",
      );
      setSubmitting(false);
    }
  }

  if (loadingJob) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-6 h-6 animate-spin text-[var(--muted-foreground)]" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3 text-center">
        <AlertCircle className="w-10 h-10 job-danger-text" />
        <p className="font-semibold">{loadError}</p>
        <Link
          href="/jobs"
          className="text-sm text-[var(--primary)] hover:underline"
        >
          Back to listings
        </Link>
      </div>
    );
  }

  if (!canEdit) return null;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href={`/jobs/${id}`}
          className="inline-flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to job
        </Link>
        <span className="text-[var(--muted-foreground)]">/</span>
        <span className="text-sm font-semibold text-[var(--foreground)]">
          Edit Job
        </span>
      </div>

      <div className="flex gap-6 items-start">
        {/* ── Left: Form ── */}
        <form onSubmit={handleSubmit} className="flex-1 min-w-0 space-y-5">
          <div className="p-6 rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm space-y-5">
            <h1 className="text-lg font-bold text-[var(--foreground)]">
              Edit Job Details
            </h1>

            {/* Title */}
            <div className="space-y-1.5">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-[var(--foreground)]"
              >
                Job Title <span className="job-required-mark">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Senior Frontend Engineer"
                maxLength={120}
                className="w-full px-3 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-shadow"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-[var(--foreground)]"
              >
                Description <span className="job-required-mark">*</span>
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={8}
                placeholder="Describe the role, responsibilities, qualifications…"
                className="w-full px-3 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-shadow resize-y"
              />
            </div>

            {submitError && (
              <p className="job-danger-text text-sm">{submitError}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Link
              href={`/jobs/${id}`}
              className="px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] text-sm font-semibold hover:bg-[var(--accent)] transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {submitting ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>

        {/* ── Right sidebar ── */}
        <div className="hidden lg:flex flex-col w-72 shrink-0 gap-5">
          {/* Skills tag UI */}
          <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-[var(--foreground)]">
              Required Skills
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Add skill…"
                className="flex-1 min-w-0 px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-shadow"
              />
              <button
                type="button"
                onClick={() => addTag(tagInput)}
                className="px-3 py-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-[var(--secondary)] text-[var(--secondary-foreground)]"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="job-danger-text transition-colors cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <div>
              <p className="text-xs text-[var(--muted-foreground)] mb-2">
                Suggestions
              </p>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_TAGS.filter((t) => !tags.includes(t)).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => addTag(t)}
                    className="text-xs px-2 py-0.5 rounded-full border border-[var(--border)] text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] transition-colors cursor-pointer"
                  >
                    + {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Live preview */}
          <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
            <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-[var(--foreground)]">
              <Eye className="w-4 h-4 text-[var(--muted-foreground)]" />
              Preview
            </div>
            <div className="space-y-1.5">
              <p className="font-semibold text-sm text-[var(--foreground)] truncate">
                {title || "Job Title"}
              </p>
              <p className="text-xs text-[var(--muted-foreground)] line-clamp-3">
                {description || "Job description will appear here…"}
              </p>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {tags.slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--secondary)] text-[var(--secondary-foreground)]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

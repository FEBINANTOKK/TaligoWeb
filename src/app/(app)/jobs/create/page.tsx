"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, X, Zap, Loader2, Eye } from "lucide-react";
import { createJob } from "@/lib/jobs";
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

export default function CreateJobPage() {
  const router = useRouter();
  const ability = useContext(AbilityContext);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not authorized (checked once abilities settle)
  const canCreate =
    ability.can("CREATE", "Job") || ability.can("MANAGE", "OrgJob");

  useEffect(() => {
    // Only redirect after CASL has hydrated (ability rules are set)
    const hasAnyAbility =
      ability.can("READ", "Profile") || ability.can("READ", "Settings");
    if (hasAnyAbility && !canCreate) {
      router.replace("/jobs");
    }
  }, [canCreate, ability, router]);

  function addTag(tag: string) {
    const t = tag.trim();
    if (t && !tags.includes(t)) {
      setTags((prev) => [...prev, t]);
    }
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
      setError("Title and description are required.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await createJob({
        title: title.trim(),
        description: description.trim(),
        tags,
      });
      router.push("/jobs");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create job");
      setSubmitting(false);
    }
  }

  if (!canCreate) return null;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/jobs"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Jobs
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-sm font-semibold text-foreground">
          Post New Job
        </span>
      </div>

      <div className="flex gap-6 items-start">
        {/* ── Left: Form ── */}
        <form onSubmit={handleSubmit} className="flex-1 min-w-0 space-y-5">
          <div className="p-6 rounded-xl border border-border bg-card shadow-sm space-y-5">
            <h1 className="text-lg font-bold text-foreground">Job Details</h1>

            {/* Title */}
            <div className="space-y-1.5">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-foreground"
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
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-foreground"
              >
                Description <span className="job-required-mark">*</span>
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={8}
                placeholder="Describe the role, responsibilities, qualifications…"
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow resize-y"
              />
            </div>

            {error && <p className="job-danger-text text-sm">{error}</p>}
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3">
            <Link
              href="/jobs"
              className="px-4 py-2 rounded-lg border border-border bg-card text-foreground text-sm font-semibold hover:bg-accent transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              {submitting ? "Posting…" : "Post Job"}
            </button>
          </div>
        </form>

        {/* ── Right sidebar ── */}
        <div className="hidden lg:flex flex-col w-72 shrink-0 gap-5">
          {/* Skills tag UI */}
          <div className="p-5 rounded-xl border border-border bg-card shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-foreground">
              Required Skills
            </h3>

            {/* Tag input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Add skill…"
                className="flex-1 min-w-0 px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
              />
              <button
                type="button"
                onClick={() => addTag(tagInput)}
                className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Added tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground"
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

            {/* Suggestions */}
            <div>
              <p className="text-xs text-muted-foreground mb-2">Suggestions</p>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_TAGS.filter((t) => !tags.includes(t)).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => addTag(t)}
                    className="text-xs px-2 py-0.5 rounded-full border border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
                  >
                    + {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* AI Insight (static) */}
          <div className="job-highlight-panel p-5 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider opacity-80">
                AI Insight
              </span>
            </div>
            <p className="text-sm font-semibold leading-snug mb-1">
              Add salary range to get 3× more applicants.
            </p>
            <p className="text-xs opacity-75">
              Listings with salary details receive significantly higher
              candidate engagement.
            </p>
          </div>

          {/* Live preview card */}
          <div className="p-5 rounded-xl border border-border bg-card shadow-sm">
            <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-foreground">
              <Eye className="w-4 h-4 text-muted-foreground" />
              Preview
            </div>
            <div className="space-y-1.5">
              <p className="font-semibold text-sm text-foreground truncate">
                {title || "Job Title"}
              </p>
              <p className="text-xs text-muted-foreground line-clamp-3">
                {description || "Job description will appear here…"}
              </p>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {tags.slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="text-[10px] px-1.5 py-0.5 rounded-full bg-secondary text-secondary-foreground"
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

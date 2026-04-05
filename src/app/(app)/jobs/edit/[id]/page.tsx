"use client";

import { useContext, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import {
  getJobById,
  updateJob,
  type Job,
  type JobStatus,
  type JobType,
  type WorkMode,
  type UpdateJobData,
} from "@/lib/jobs";
import { AbilityContext } from "@/providers/AbilityProvider";

const JOB_TYPES: JobType[] = [
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
  "INTERN",
  "FREELANCE",
];

const WORK_MODES: WorkMode[] = ["ONSITE", "REMOTE", "HYBRID"];

type ToastState = {
  type: "success" | "error";
  message: string;
} | null;

function normalizeSkillsInput(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .filter((skill, index, list) => list.indexOf(skill) === index);
}

export default function EditJobPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const ability = useContext(AbilityContext);

  const canEdit =
    ability.can("UPDATE", "Job") ||
    ability.can("UPDATE", "OrgJob") ||
    ability.can("MANAGE", "OrgJob");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState>(null);

  const [initialJob, setInitialJob] = useState<Job | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState<JobType>("FULL_TIME");
  const [workMode, setWorkMode] = useState<WorkMode>("ONSITE");
  const [status, setStatus] = useState<JobStatus>("DRAFT");
  const [skillsInput, setSkillsInput] = useState("");

  const skills = useMemo(
    () => normalizeSkillsInput(skillsInput),
    [skillsInput],
  );

  useEffect(() => {
    const hasInitializedAbility =
      ability.can("READ", "Profile") || ability.can("READ", "Settings");

    if (hasInitializedAbility && !canEdit) {
      router.replace(`/jobs/${id}`);
    }
  }, [ability, canEdit, id, router]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getJobById(id);
        if (cancelled) {
          return;
        }

        setInitialJob(data);
        setTitle(data.title ?? "");
        setDescription(data.description ?? "");
        setLocation(data.location ?? "");
        setJobType(data.jobType ?? "FULL_TIME");
        setWorkMode(data.workMode ?? "ONSITE");
        setStatus(data.status ?? "DRAFT");
        setSkillsInput((data.skills ?? data.tags ?? []).join(", "));
      } catch (e: unknown) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load job");
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
    if (!toast) {
      return;
    }

    const timer = window.setTimeout(() => setToast(null), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function buildPartialPayload(): UpdateJobData {
    if (!initialJob) {
      return {};
    }

    const payload: UpdateJobData = {};

    const normalizedTitle = title.trim();
    const normalizedDescription = description.trim();
    const normalizedLocation = location.trim();

    if (normalizedTitle !== (initialJob.title ?? "")) {
      payload.title = normalizedTitle;
    }

    if (normalizedDescription !== (initialJob.description ?? "")) {
      payload.description = normalizedDescription;
    }

    if (normalizedLocation !== (initialJob.location ?? "")) {
      payload.location = normalizedLocation || undefined;
    }

    if ((initialJob.jobType ?? "FULL_TIME") !== jobType) {
      payload.jobType = jobType;
    }

    if ((initialJob.workMode ?? "ONSITE") !== workMode) {
      payload.workMode = workMode;
    }

    if ((initialJob.status ?? "DRAFT") !== status) {
      payload.status = status;
    }

    const initialSkills = (initialJob.skills ?? initialJob.tags ?? []).join(
      "|",
    );
    const nextSkills = skills.join("|");

    if (initialSkills !== nextSkills) {
      payload.skills = skills;
    }

    return payload;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      setError("Title and description are required.");
      return;
    }

    const payload = buildPartialPayload();

    if (Object.keys(payload).length === 0) {
      setToast({ type: "success", message: "No changes to update" });
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await updateJob(id, payload);
      setToast({ type: "success", message: "Job updated" });
      window.setTimeout(() => {
        router.replace(`/jobs/${id}`);
      }, 500);
    } catch (e: unknown) {
      setToast({
        type: "error",
        message: e instanceof Error ? e.message : "Failed to update job",
      });
      setSubmitting(false);
    }
  }

  if (!canEdit) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error && !initialJob) {
    return (
      <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
        {error}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
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

      <div className="flex items-center gap-3">
        <Link
          href={`/jobs/${id}`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Job
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-xl border border-border bg-card p-6 shadow-sm"
      >
        <h1 className="text-xl font-bold text-foreground">Edit Job</h1>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Title <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={120}
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Description <span className="text-destructive">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={7}
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as JobStatus)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="DRAFT">DRAFT</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="CLOSED">CLOSED</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Job Type
            </label>
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value as JobType)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {JOB_TYPES.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Work Mode
            </label>
            <select
              value={workMode}
              onChange={(e) => setWorkMode(e.target.value as WorkMode)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {WORK_MODES.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Skills (comma-separated)
            </label>
            <input
              type="text"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {skills.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {error && (
          <p className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-3">
          <Link
            href={`/jobs/${id}`}
            className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {submitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

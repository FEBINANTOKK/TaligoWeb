"use client";

import { useContext, useEffect, useMemo, useState } from "react";
import { Plus, Search, Loader2, Briefcase, Building2 } from "lucide-react";
import Link from "next/link";
import JobCard from "@/components/jobs/JobCard";
import { API_BASE } from "@/lib/api";
import { getJobs, getOrgJobs, type Job } from "@/lib/jobs";
import { AbilityContext } from "@/providers/AbilityProvider";

type StatusTab = "ACTIVE" | "CLOSED" | "DRAFT";
type JobsPageRole = "candidate" | "recruiter" | "orgadmin";

interface UserContext {
  role: JobsPageRole | null;
  organizationId: string | null;
}

function normalizeRole(value: unknown): JobsPageRole | null {
  if (value === "candidate" || value === "CANDIDATE") {
    return "candidate";
  }
  if (value === "recruiter" || value === "RECRUITER") {
    return "recruiter";
  }
  if (value === "orgadmin" || value === "ORGADMIN" || value === "ORG_ADMIN") {
    return "orgadmin";
  }
  return null;
}

export default function JobsPage() {
  const ability = useContext(AbilityContext);

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<StatusTab>("ACTIVE");
  const [userContext, setUserContext] = useState<UserContext>({
    role: null,
    organizationId: null,
  });
  const [userResolved, setUserResolved] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadUserContext = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/user/me`, {
          credentials: "include",
        });

        if (!res.ok) {
          if (!cancelled) {
            setUserContext({ role: null, organizationId: null });
            setActiveTab("ACTIVE");
          }
          return;
        }

        const data = (await res.json()) as {
          data?: {
            role?: unknown;
            organizationId?: unknown;
          };
        };

        const nextRole = normalizeRole(data?.data?.role);
        const nextOrganizationId =
          typeof data?.data?.organizationId === "string"
            ? data.data.organizationId
            : null;

        if (cancelled) {
          return;
        }

        setUserContext({
          role: nextRole,
          organizationId: nextOrganizationId,
        });

        setActiveTab("ACTIVE");
      } catch {
        if (!cancelled) {
          setUserContext({ role: null, organizationId: null });
          setActiveTab("ACTIVE");
        }
      } finally {
        if (!cancelled) {
          setUserResolved(true);
        }
      }
    };

    void loadUserContext();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!userResolved) {
      return;
    }

    let cancelled = false;

    const fetchJobs = async () => {
      setLoading(true);
      setError(null);

      try {
        const isOrgRole =
          userContext.role === "recruiter" || userContext.role === "orgadmin";

        const nextJobs = isOrgRole
          ? userContext.organizationId
            ? await getOrgJobs(userContext.organizationId)
            : []
          : await getJobs();

        if (!cancelled) {
          setJobs(nextJobs);
        }
      } catch (e: unknown) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load jobs");
          setJobs([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void fetchJobs();

    return () => {
      cancelled = true;
    };
  }, [userContext.organizationId, userContext.role, userResolved]);

  const showStatusTabs =
    userContext.role === "recruiter" || userContext.role === "orgadmin";

  const canCreate =
    ability.can("CREATE", "Job") ||
    ability.can("CREATE", "OrgJob") ||
    ability.can("MANAGE", "OrgJob");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    const searchedJobs = jobs.filter((job) => {
      const skills = job.skills ?? job.tags ?? [];
      return (
        !query ||
        job.title.toLowerCase().includes(query) ||
        job.location?.toLowerCase().includes(query) ||
        job.jobType?.toLowerCase().includes(query) ||
        job.workMode?.toLowerCase().includes(query) ||
        skills.some((skill) => skill.toLowerCase().includes(query))
      );
    });

    if (!showStatusTabs) {
      return searchedJobs;
    }

    return searchedJobs.filter((job) => (job.status ?? "DRAFT") === activeTab);
  }, [activeTab, jobs, search, showStatusTabs]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Job Listings</h1>
          <p className="text-sm text-muted-foreground">
            {loading ? "Loading jobs..." : `${filtered.length} jobs available`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {(ability.can("MANAGE", "OrgJob") ||
            ability.can("UPDATE", "OrgJob")) && (
            <Link
              href="/jobs/manage"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
            >
              <Building2 className="h-4 w-4" />
              Manage Jobs
            </Link>
          )}

          {canCreate && (
            <Link
              href="/jobs/create"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              Create Job
            </Link>
          )}
        </div>
      </div>

      {showStatusTabs && (
        <div className="inline-flex items-center gap-1 rounded-xl border border-border bg-card p-1 shadow-sm">
          <button
            type="button"
            onClick={() => setActiveTab("ACTIVE")}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              activeTab === "ACTIVE"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            Active
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("CLOSED")}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              activeTab === "CLOSED"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            Closed
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("DRAFT")}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              activeTab === "DRAFT"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            Draft
          </button>
        </div>
      )}

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title, location, job type, mode, or skill"
          className="w-full rounded-lg border border-border bg-background py-2.5 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {loading && (
        <div className="flex min-h-64 items-center justify-center rounded-xl border border-border bg-card">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading jobs...
          </div>
        </div>
      )}

      {!loading && error && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-border bg-card text-center">
          <Briefcase className="mb-3 h-10 w-10 text-muted-foreground" />
          <p className="font-semibold text-foreground">No jobs found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {search
              ? "Try a different search keyword."
              : showStatusTabs
                ? `No ${activeTab.toLowerCase()} jobs available in your organization.`
                : "No jobs are available right now."}
          </p>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}

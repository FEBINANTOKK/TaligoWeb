"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  TrendingUp,
  Zap,
  BarChart3,
  Briefcase,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import JobCard from "@/components/jobs/JobCard";
import { API_BASE } from "@/lib/api";
import { getJobs, getOrgJobs, type Job } from "@/lib/jobs";
import { Can } from "@/providers/AbilityProvider";

type JobTab = "ORG" | "ALL";

type JobsPageRole = "candidate" | "recruiter" | "orgadmin";

interface UserContext {
  role: JobsPageRole | null;
  organizationId: string | null;
}

const MARKET_STATS = [
  { label: "Frontend roles open", value: "2,340", change: "+12%" },
  { label: "Backend roles open", value: "1,820", change: "+8%" },
  { label: "Design roles open", value: "940", change: "+5%" },
  { label: "DevOps roles open", value: "670", change: "+15%" },
];

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<JobTab>("ALL");
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
            setUserResolved(true);
          }
          return;
        }

        const data = (await res.json()) as {
          data?: {
            role?: unknown;
            organizationId?: unknown;
          };
        };

        const nextRole =
          data?.data?.role === "candidate" ||
          data?.data?.role === "recruiter" ||
          data?.data?.role === "orgadmin"
            ? data.data.role
            : null;

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

        setActiveTab(
          nextRole === "recruiter" || nextRole === "orgadmin" ? "ORG" : "ALL",
        );
      } catch {
        if (cancelled) {
          return;
        }

        setUserContext({ role: null, organizationId: null });
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
        const nextJobs =
          activeTab === "ORG" && userContext.organizationId
            ? await getOrgJobs(userContext.organizationId)
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
  }, [activeTab, userContext.organizationId, userResolved]);

  const showTabs =
    userContext.role === "recruiter" || userContext.role === "orgadmin";

  const filtered = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company?.toLowerCase().includes(search.toLowerCase()) ||
      j.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Job Listings</h1>
          <p className="text-sm text-muted-foreground">
            {loading
              ? "Loading opportunities..."
              : `${jobs.length} opportunities available`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Can I="MANAGE" a="OrgJob">
            <Link
              href="/jobs/manage"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card text-foreground text-sm font-semibold hover:bg-accent transition-colors"
            >
              <BarChart3 className="w-4 h-4" />
              Manage Jobs
            </Link>
            <Link
              href="/jobs/create"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" />
              Post Job
            </Link>
          </Can>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="flex gap-6 items-start">
        {/* ── Left column (jobs) ── */}
        <div className="flex-1 min-w-0 space-y-5">
          {showTabs && (
            <div className="inline-flex items-center gap-1 rounded-xl border border-border bg-card p-1 shadow-sm transition-all">
              <button
                type="button"
                onClick={() => setActiveTab("ORG")}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                  activeTab === "ORG"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                Organization Jobs
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("ALL")}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                  activeTab === "ALL"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                All Jobs
              </button>
            </div>
          )}

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, company or skill…"
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
            />
          </div>

          {/* States */}
          {loading && (
            <div className="flex min-h-64 items-center justify-center rounded-2xl border border-border bg-card shadow-sm">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Loading jobs...</span>
              </div>
            </div>
          )}

          {!loading && error && (
            <div className="job-feedback-error rounded-xl p-5 text-sm">
              {error}
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Briefcase className="w-10 h-10 text-muted-foreground mb-3" />
              <p className="font-semibold text-foreground">No jobs found</p>
              <p className="text-sm text-muted-foreground mt-1">
                {search
                  ? "Try a different search term."
                  : activeTab === "ORG"
                    ? "No jobs found for your organization yet."
                    : "Check back later."}
              </p>
            </div>
          )}

          {!loading && !error && filtered.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2">
              {filtered.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          )}
        </div>

        {/* ── Right sidebar ── */}
        <div className="hidden lg:flex flex-col w-72 shrink-0 gap-5">
          {/* Curation Insight */}
          <div className="job-highlight-panel rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider opacity-80">
                Curation Insight
              </span>
            </div>
            <p className="text-lg font-bold leading-snug mb-1">
              87% of candidates land faster with tailored profiles.
            </p>
            <p className="text-xs opacity-75">
              Complete your profile to get matched with top roles instantly.
            </p>
            <Link
              href="/profile"
              className="mt-4 inline-block text-xs font-semibold bg-white/20 hover:bg-white/30 transition-colors px-3 py-1.5 rounded-lg"
            >
              Update Profile →
            </Link>
          </div>

          {/* Market Stats */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">
                Market Trends
              </h3>
            </div>
            <ul className="space-y-3">
              {MARKET_STATS.map((stat) => (
                <li
                  key={stat.label}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="text-xs font-medium text-foreground">
                      {stat.label}
                    </p>
                    <p className="text-sm font-bold text-foreground">
                      {stat.value}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-primary">
                    {stat.change}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Featured Card */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
              Featured
            </span>
            <h4 className="mt-1 font-semibold text-sm text-foreground">
              Full Stack Engineer
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              TechCorp · Remote
            </p>
            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
              Build scalable services and modern React UIs in a fast-growing
              product team.
            </p>
            <div className="flex flex-wrap gap-1 mt-3">
              {["React", "Node.js", "AWS"].map((t) => (
                <span
                  key={t}
                  className="text-[11px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

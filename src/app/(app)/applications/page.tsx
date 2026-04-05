"use client";

import { useEffect, useMemo, useState } from "react";
import { Briefcase } from "lucide-react";
import JobCard from "@/components/dashboard/JobCard";
import OrgAdminTabs, {
  type OrgAdminTab,
} from "@/components/dashboard/OrgAdminTabs";
import { API_BASE } from "@/lib/api";
import { getMyApplications, type ApplicationItem } from "@/lib/applications";
import { getMyJobs, getOrgJobs, type Job } from "@/lib/jobs";

type Role = "candidate" | "recruiter" | "orgadmin" | null;

interface UserContext {
  role: Role;
  organizationId: string | null;
}

function normalizeRole(value: unknown): Role {
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

function getStatusClass(status?: string) {
  const value = (status ?? "applied").toLowerCase();

  if (value === "shortlisted") {
    return "border border-green-200 bg-green-100 text-green-700";
  }
  if (value === "rejected") {
    return "border border-red-200 bg-red-100 text-red-700";
  }
  return "border border-zinc-200 bg-zinc-100 text-zinc-700";
}

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

function CandidateLoadingSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="space-y-2 p-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={`candidate-skeleton-${index}`}
            className="h-12 animate-pulse rounded-md bg-muted/60"
          />
        ))}
      </div>
    </div>
  );
}

function CardLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 justify-items-start gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={`job-card-skeleton-${index}`}
          className="h-[3cm] w-[10cm] animate-pulse rounded-xl border border-border bg-muted/60"
        />
      ))}
    </div>
  );
}

function EmptyState({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-border bg-card text-center">
      <Briefcase className="mb-3 h-10 w-10 text-muted-foreground" />
      <p className="font-semibold text-foreground">{title}</p>
      {subtitle && (
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      )}
    </div>
  );
}

function CandidateTable({ items }: { items: ApplicationItem[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-225 text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="px-4 py-3 text-left font-semibold text-foreground">
                Job Title
              </th>
              <th className="w-44 px-4 py-3 text-left font-semibold text-foreground">
                Location
              </th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">
                Job Type
              </th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">
                Work Mode
              </th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">
                Status
              </th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">
                Applied Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.map((item) => (
              <tr
                key={item._id}
                className="transition-colors hover:bg-accent/40"
              >
                <td className="px-4 py-3 font-medium text-foreground">
                  {item.job?.title ?? "Untitled job"}
                </td>
                <td
                  className="max-w-44 truncate px-4 py-3 text-muted-foreground"
                  title={item.job?.location ?? "Not specified"}
                >
                  {item.job?.location ?? "Not specified"}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {item.job?.jobType ?? "Not specified"}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {item.job?.workMode ?? "Not specified"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusClass(item.status)}`}
                  >
                    {(item.status ?? "applied").toLowerCase()}
                  </span>
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
  );
}

function JobGrid({ jobs }: { jobs: Job[] }) {
  return (
    <div className="grid grid-cols-1 justify-items-start gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {jobs.map((job) => (
        <JobCard
          key={job._id}
          job={{
            _id: job._id,
            title: job.title,
            organizationName: job.company,
            description: job.description,
          }}
        />
      ))}
    </div>
  );
}

export default function ApplicationsPage() {
  const [error, setError] = useState<string | null>(null);

  const [userContext, setUserContext] = useState<UserContext>({
    role: null,
    organizationId: null,
  });
  const [userReady, setUserReady] = useState(false);

  const [candidateApplications, setCandidateApplications] = useState<
    ApplicationItem[]
  >([]);
  const [recruiterJobs, setRecruiterJobs] = useState<Job[]>([]);

  const [orgAdminTab, setOrgAdminTab] = useState<OrgAdminTab>("MY_JOBS");
  const [orgAdminMyJobs, setOrgAdminMyJobs] = useState<Job[] | null>(null);
  const [orgAdminAllOrgJobs, setOrgAdminAllOrgJobs] = useState<Job[] | null>(
    null,
  );

  const [loadingCandidate, setLoadingCandidate] = useState(false);
  const [loadingRecruiter, setLoadingRecruiter] = useState(false);
  const [loadingOrgMy, setLoadingOrgMy] = useState(false);
  const [loadingOrgRecruiters, setLoadingOrgRecruiters] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadUserContext = async () => {
      try {
        const meRes = await fetch(`${API_BASE}/api/user/me`, {
          credentials: "include",
        });

        if (!meRes.ok) {
          throw new Error("Failed to load user context");
        }

        const meJson = (await meRes.json()) as {
          data?: {
            role?: unknown;
            organizationId?: unknown;
          };
        };

        if (cancelled) {
          return;
        }

        setUserContext({
          role: normalizeRole(meJson?.data?.role),
          organizationId:
            typeof meJson?.data?.organizationId === "string"
              ? meJson.data.organizationId
              : null,
        });
      } catch (e: unknown) {
        if (!cancelled) {
          setError(
            e instanceof Error ? e.message : "Failed to load user context",
          );
          setUserContext({ role: null, organizationId: null });
        }
      } finally {
        if (!cancelled) {
          setUserReady(true);
        }
      }
    };

    void loadUserContext();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!userReady) {
      return;
    }

    let cancelled = false;

    const loadRoleData = async () => {
      setError(null);

      try {
        if (userContext.role === "candidate") {
          setLoadingCandidate(true);
          const rows = await getMyApplications();
          if (!cancelled) {
            setCandidateApplications(rows);
          }
          return;
        }

        if (userContext.role === "recruiter") {
          setLoadingRecruiter(true);
          const jobs = await getMyJobs();
          if (!cancelled) {
            setRecruiterJobs(jobs);
          }
          return;
        }

        if (userContext.role === "orgadmin") {
          setOrgAdminTab("MY_JOBS");
          setLoadingOrgMy(true);
          const myJobs = await getMyJobs();
          if (!cancelled) {
            setOrgAdminMyJobs(myJobs);
          }
        }
      } catch (e: unknown) {
        if (!cancelled) {
          setError(
            e instanceof Error ? e.message : "Failed to load applications data",
          );
          setCandidateApplications([]);
          setRecruiterJobs([]);
          setOrgAdminMyJobs([]);
          setOrgAdminAllOrgJobs([]);
        }
      } finally {
        if (!cancelled) {
          setLoadingCandidate(false);
          setLoadingRecruiter(false);
          setLoadingOrgMy(false);
        }
      }
    };

    void loadRoleData();

    return () => {
      cancelled = true;
    };
  }, [userReady, userContext.role]);

  useEffect(() => {
    if (
      !userReady ||
      userContext.role !== "orgadmin" ||
      orgAdminTab !== "ALL_RECRUITER_JOBS" ||
      orgAdminAllOrgJobs !== null
    ) {
      return;
    }

    let cancelled = false;

    const loadRecruiterJobs = async () => {
      if (!userContext.organizationId) {
        setOrgAdminAllOrgJobs([]);
        return;
      }

      setLoadingOrgRecruiters(true);

      try {
        const orgJobs = await getOrgJobs(userContext.organizationId);
        if (!cancelled) {
          setOrgAdminAllOrgJobs(orgJobs);
        }
      } catch (e: unknown) {
        if (!cancelled) {
          setError(
            e instanceof Error ? e.message : "Failed to load recruiter jobs",
          );
          setOrgAdminAllOrgJobs([]);
        }
      } finally {
        if (!cancelled) {
          setLoadingOrgRecruiters(false);
        }
      }
    };

    void loadRecruiterJobs();

    return () => {
      cancelled = true;
    };
  }, [
    userReady,
    userContext.organizationId,
    userContext.role,
    orgAdminAllOrgJobs,
    orgAdminTab,
  ]);

  const title = useMemo(() => {
    if (userContext.role === "candidate") {
      return "My Applications";
    }
    if (userContext.role === "recruiter") {
      return "My Posted Jobs";
    }
    if (userContext.role === "orgadmin") {
      return "Organization Jobs";
    }
    return "Applications";
  }, [userContext.role]);

  const subtitle = useMemo(() => {
    if (userContext.role === "candidate") {
      return "Tracking your submitted applications";
    }
    if (userContext.role === "recruiter") {
      return "Jobs created by you";
    }
    if (userContext.role === "orgadmin") {
      return "Switch between your jobs and recruiter jobs";
    }
    return "Role-based applications dashboard";
  }, [userContext.role]);

  const orgAdminRecruiterJobs = useMemo(() => {
    const allJobs = orgAdminAllOrgJobs ?? [];
    const myJobs = orgAdminMyJobs ?? [];

    const myIds = new Set(myJobs.map((job) => job._id));
    return allJobs.filter((job) => !myIds.has(job._id));
  }, [orgAdminAllOrgJobs, orgAdminMyJobs]);

  const showCandidateLoading =
    !userReady || (userContext.role === "candidate" && loadingCandidate);
  const showRecruiterLoading =
    !userReady || (userContext.role === "recruiter" && loadingRecruiter);
  const showOrgAdminLoading =
    !userReady ||
    (userContext.role === "orgadmin" &&
      ((orgAdminTab === "MY_JOBS" && loadingOrgMy) ||
        (orgAdminTab === "ALL_RECRUITER_JOBS" && loadingOrgRecruiters)));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      {userContext.role === "orgadmin" && (
        <OrgAdminTabs
          activeTab={orgAdminTab}
          onChange={setOrgAdminTab}
          myJobsCount={orgAdminMyJobs?.length ?? 0}
          recruiterJobsCount={orgAdminRecruiterJobs.length}
        />
      )}

      {showCandidateLoading && <CandidateLoadingSkeleton />}
      {showRecruiterLoading && <CardLoadingSkeleton />}
      {showOrgAdminLoading && <CardLoadingSkeleton />}

      {!showCandidateLoading &&
        !error &&
        userContext.role === "candidate" &&
        candidateApplications.length === 0 && (
          <EmptyState title="You have not applied to any jobs yet" />
        )}

      {!showCandidateLoading &&
        !error &&
        userContext.role === "candidate" &&
        candidateApplications.length > 0 && (
          <CandidateTable items={candidateApplications} />
        )}

      {!showRecruiterLoading &&
        !error &&
        userContext.role === "recruiter" &&
        recruiterJobs.length === 0 && <EmptyState title="No jobs found" />}

      {!showRecruiterLoading &&
        !error &&
        userContext.role === "recruiter" &&
        recruiterJobs.length > 0 && <JobGrid jobs={recruiterJobs} />}

      {!showOrgAdminLoading &&
        !error &&
        userContext.role === "orgadmin" &&
        orgAdminTab === "MY_JOBS" &&
        (orgAdminMyJobs ?? []).length === 0 && (
          <EmptyState title="No jobs found" />
        )}

      {!showOrgAdminLoading &&
        !error &&
        userContext.role === "orgadmin" &&
        orgAdminTab === "MY_JOBS" &&
        (orgAdminMyJobs ?? []).length > 0 && (
          <JobGrid jobs={orgAdminMyJobs ?? []} />
        )}

      {!showOrgAdminLoading &&
        !error &&
        userContext.role === "orgadmin" &&
        orgAdminTab === "ALL_RECRUITER_JOBS" &&
        orgAdminRecruiterJobs.length === 0 && (
          <EmptyState title="No jobs found" />
        )}

      {!showOrgAdminLoading &&
        !error &&
        userContext.role === "orgadmin" &&
        orgAdminTab === "ALL_RECRUITER_JOBS" &&
        orgAdminRecruiterJobs.length > 0 && (
          <JobGrid jobs={orgAdminRecruiterJobs} />
        )}

      {!userReady && !error && <CardLoadingSkeleton />}
      {userReady && !error && userContext.role === null && (
        <EmptyState title="No applications view available" />
      )}
    </div>
  );
}

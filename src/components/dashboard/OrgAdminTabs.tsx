"use client";

export type OrgAdminTab = "MY_JOBS" | "ALL_RECRUITER_JOBS";

interface OrgAdminTabsProps {
  activeTab: OrgAdminTab;
  onChange: (tab: OrgAdminTab) => void;
  myJobsCount: number;
  recruiterJobsCount: number;
}

export default function OrgAdminTabs({
  activeTab,
  onChange,
  myJobsCount,
  recruiterJobsCount,
}: OrgAdminTabsProps) {
  return (
    <div className="inline-flex items-center gap-1 rounded-xl border border-border bg-card p-1 shadow-sm">
      <button
        type="button"
        onClick={() => onChange("MY_JOBS")}
        className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
          activeTab === "MY_JOBS"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:bg-accent hover:text-foreground"
        }`}
      >
        My Jobs ({myJobsCount})
      </button>
      <button
        type="button"
        onClick={() => onChange("ALL_RECRUITER_JOBS")}
        className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
          activeTab === "ALL_RECRUITER_JOBS"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:bg-accent hover:text-foreground"
        }`}
      >
        All Recruiter Jobs ({recruiterJobsCount})
      </button>
    </div>
  );
}

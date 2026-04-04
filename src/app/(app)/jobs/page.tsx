"use client";

import { Briefcase, Plus, Search } from "lucide-react";

const jobs = [
  {
    id: 1,
    title: "Senior Frontend Engineer",
    department: "Engineering",
    status: "Active",
    applicants: 24,
  },
  {
    id: 2,
    title: "Product Designer",
    department: "Design",
    status: "Active",
    applicants: 18,
  },
  {
    id: 3,
    title: "DevOps Engineer",
    department: "Engineering",
    status: "Paused",
    applicants: 12,
  },
  {
    id: 4,
    title: "Marketing Manager",
    department: "Marketing",
    status: "Active",
    applicants: 31,
  },
];

export default function JobsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">
          Job Management
        </h1>
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer">
          <Plus className="w-4 h-4" />
          New Job
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
        <input
          type="search"
          placeholder="Search jobs..."
          className="w-full pl-9 pr-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-shadow"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="p-5 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--card-foreground)] shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--accent)]">
                <Briefcase className="w-5 h-5 text-[var(--accent-foreground)]" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-sm truncate">{job.title}</h3>
                <p className="text-xs text-[var(--muted-foreground)]">
                  {job.department}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span
                className={`px-2 py-1 rounded-full font-medium ${
                  job.status === "Active"
                    ? "bg-[var(--secondary)] text-[var(--secondary-foreground)]"
                    : "bg-[var(--muted)] text-[var(--muted-foreground)]"
                }`}
              >
                {job.status}
              </span>
              <span className="text-[var(--muted-foreground)]">
                {job.applicants} applicants
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { Send } from "lucide-react";

const applications = [
  {
    id: 1,
    candidate: "Alice Johnson",
    job: "Senior Frontend Engineer",
    stage: "Interview",
    date: "2026-03-28",
  },
  {
    id: 2,
    candidate: "Bob Smith",
    job: "Product Designer",
    stage: "Screening",
    date: "2026-03-30",
  },
  {
    id: 3,
    candidate: "Carol Davis",
    job: "DevOps Engineer",
    stage: "Offer",
    date: "2026-03-25",
  },
  {
    id: 4,
    candidate: "Dan Wilson",
    job: "Marketing Manager",
    stage: "Applied",
    date: "2026-04-01",
  },
  {
    id: 5,
    candidate: "Eva Martinez",
    job: "Senior Frontend Engineer",
    stage: "Interview",
    date: "2026-04-02",
  },
];

const stageColors: Record<string, string> = {
  Applied: "bg-[var(--muted)] text-[var(--muted-foreground)]",
  Screening: "bg-[var(--secondary)] text-[var(--secondary-foreground)]",
  Interview: "bg-[var(--accent)] text-[var(--accent-foreground)]",
  Offer: "bg-[var(--primary)] text-[var(--primary-foreground)]",
};

export default function ApplicationsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--foreground)]">
        Applications
      </h1>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--muted)]">
                <th className="text-left px-4 py-3 font-medium text-[var(--muted-foreground)]">
                  Candidate
                </th>
                <th className="text-left px-4 py-3 font-medium text-[var(--muted-foreground)]">
                  Job
                </th>
                <th className="text-left px-4 py-3 font-medium text-[var(--muted-foreground)]">
                  Stage
                </th>
                <th className="text-left px-4 py-3 font-medium text-[var(--muted-foreground)]">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr
                  key={app.id}
                  className="border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--accent)] transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-[var(--card-foreground)]">
                    <div className="flex items-center gap-2">
                      <Send className="w-4 h-4 text-[var(--muted-foreground)]" />
                      {app.candidate}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[var(--muted-foreground)]">
                    {app.job}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        stageColors[app.stage] ?? ""
                      }`}
                    >
                      {app.stage}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[var(--muted-foreground)]">
                    {app.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

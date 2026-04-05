"use client";

import Link from "next/link";
import { MapPin, ArrowRight, Briefcase, Clock3, Building2 } from "lucide-react";
import type { Job } from "@/lib/jobs";

interface JobCardProps {
  job: Job;
}

function getStatusClass(status?: Job["status"]) {
  if (status === "ACTIVE") {
    return "border border-green-200 bg-green-100 text-green-700";
  }
  if (status === "CLOSED") {
    return "border border-red-200 bg-red-100 text-red-700";
  }
  return "border border-zinc-200 bg-zinc-100 text-zinc-700";
}

export default function JobCard({ job }: JobCardProps) {
  const skills = job.skills ?? job.tags ?? [];
  const dateLabel = job.createdAt
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date(job.createdAt))
    : null;

  return (
    <Link href={`/jobs/${job._id}`} className="block group">
      <div className="p-5 rounded-xl border border-border bg-card text-card-foreground shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center shrink-0">
              <Briefcase className="w-5 h-5 text-accent-foreground" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                {job.title}
              </h3>
              <p className="text-xs text-muted-foreground truncate">
                {job.company ?? "Organization"}
              </p>
            </div>
          </div>
          <span
            className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${getStatusClass(job.status)}`}
          >
            {job.status ?? "DRAFT"}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-1.5 text-xs text-muted-foreground mb-3">
          {job.location && (
            <span className="flex items-center gap-1.5 truncate">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              {job.location}
            </span>
          )}

          <span className="flex items-center gap-1.5 truncate">
            <Building2 className="w-3.5 h-3.5 shrink-0" />
            {job.jobType ?? "FULL_TIME"}
            <span className="text-muted-foreground/60">|</span>
            {job.workMode ?? "ONSITE"}
          </span>
        </div>

        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
          {job.description}
        </p>

        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {skills.slice(0, 4).map((skill) => (
              <span
                key={skill}
                className="text-[11px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground"
              >
                {skill}
              </span>
            ))}
            {skills.length > 4 && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                +{skills.length - 4}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Clock3 className="h-3.5 w-3.5" />
            {dateLabel ? `Posted ${dateLabel}` : "Recently posted"}
          </div>

          <span className="flex items-center gap-1 text-xs font-semibold text-primary group-hover:gap-2 transition-all">
            View Details <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}

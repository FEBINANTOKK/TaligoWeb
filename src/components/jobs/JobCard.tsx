"use client";

import Link from "next/link";
import { MapPin, DollarSign, ArrowRight, Briefcase } from "lucide-react";
import type { Job } from "@/lib/jobs";

interface JobCardProps {
  job: Job;
}

const AVATAR_INITIALS = ["A", "B", "C"];

export default function JobCard({ job }: JobCardProps) {
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
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
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
          <span className="job-feature-badge shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap">
            High Match
          </span>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-4 mb-3 text-xs text-muted-foreground">
          {job.location && (
            <span className="flex items-center gap-1 truncate">
              <MapPin className="w-3 h-3 shrink-0" />
              {job.location}
            </span>
          )}
          <span className="flex items-center gap-1 shrink-0">
            <DollarSign className="w-3 h-3" />
            {job.salary ?? "Competitive"}
          </span>
        </div>

        {/* Description */}
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
          {job.description}
        </p>

        {/* Tags */}
        {job.tags && job.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {job.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[11px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground"
              >
                {tag}
              </span>
            ))}
            {job.tags.length > 3 && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                +{job.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {AVATAR_INITIALS.map((l) => (
                <div
                  key={l}
                  className="w-6 h-6 rounded-full bg-muted border-2 border-card flex items-center justify-center text-[9px] font-bold text-muted-foreground"
                >
                  {l}
                </div>
              ))}
            </div>
            <span className="text-[10px] text-muted-foreground">
              +12 applied
            </span>
          </div>
          <span className="flex items-center gap-1 text-xs font-semibold text-primary group-hover:gap-2 transition-all">
            View Details <ArrowRight className="w-3 h-3" />
          </span>
        </div>

        {dateLabel && (
          <p className="mt-2 text-[10px] text-muted-foreground">
            Posted {dateLabel}
          </p>
        )}
      </div>
    </Link>
  );
}

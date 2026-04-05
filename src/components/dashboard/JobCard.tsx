// "use client";

// import { useRouter } from "next/navigation";
// import { Building2, Users } from "lucide-react";

// export interface DashboardJobCardData {
//   _id: string;
//   title: string;
//   organizationName?: string;
//   description: string;
// }

// interface DashboardJobCardProps {
//   job: DashboardJobCardData;
// }

// export default function JobCard({ job }: DashboardJobCardProps) {
//   const router = useRouter();

//   return (
//     <article className="h-[3cm] w-[10cm] rounded-xl border border-border bg-card p-3 text-card-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
//       <div className="flex h-full flex-col justify-between gap-2">
//         <div className="space-y-1">
//           <h3 className="truncate text-sm font-semibold text-foreground">
//             {job.title}
//           </h3>
//           <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
//             <Building2 className="h-3.5 w-3.5" />
//             {job.organizationName ?? "Organization"}
//           </p>
//           <p className="overflow-hidden text-ellipsis text-xs text-muted-foreground [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]">
//             {job.description || "No description provided"}
//           </p>
//         </div>

//         <div className="flex justify-end">
//           <button
//             type="button"
//             onClick={() => router.push(`/jobs/${job._id}/applications`)}
//             className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-accent"
//           >
//             <Users className="h-3.5 w-3.5" />
//             View Applications
//           </button>
//         </div>
//       </div>
//     </article>
//   );
// }
"use client";

import { useRouter } from "next/navigation";
import { Building2, Users } from "lucide-react";

export interface DashboardJobCardData {
  _id: string;
  title: string;
  organizationName?: string;
  description: string;
}

interface DashboardJobCardProps {
  job: DashboardJobCardData;
}

export default function JobCard({ job }: DashboardJobCardProps) {
  const router = useRouter();

  return (
    <article className="group w-full max-w-md rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
      {/* Top Content */}
      <div className="space-y-3">
        {/* Title */}
        <h3 className="text-base font-semibold text-foreground leading-snug line-clamp-1">
          {job.title}
        </h3>

        {/* Organization */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Building2 className="h-4 w-4 opacity-80" />
          <span className="truncate">
            {job.organizationName ?? "Organization"}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {job.description || "No description provided"}
        </p>
      </div>

      {/* Divider */}
      <div className="my-4 h-px bg-border" />

      {/* Action */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          View candidates for this role
        </span>

        <button
          type="button"
          onClick={() => router.push(`/jobs/${job._id}/applications`)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-all hover:opacity-90 group-hover:scale-[1.02]"
        >
          <Users className="h-4 w-4" />
          View
        </button>
      </div>
    </article>
  );
}

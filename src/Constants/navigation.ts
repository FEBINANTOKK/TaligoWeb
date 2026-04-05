// import {
//   LayoutDashboard,
//   Briefcase,
//   FileText,
//   Send,
//   Settings,
//   type LucideIcon,
// } from "lucide-react";

// export interface NavItem {
//   label: string;
//   href: string;
//   icon: LucideIcon;
// }

// export const navigationItems: NavItem[] = [
//   { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
//   { label: "Job Management", href: "/jobs", icon: Briefcase },
//   { label: "Resume Bank", href: "/resume-bank", icon: FileText },
//   { label: "Applications", href: "/applications", icon: Send },
//   { label: "Settings", href: "/settings", icon: Settings },
// ];
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Send,
  Settings,
  Users,
  Building2,
  ShieldCheck,
  type LucideIcon,
  FilePlus,
} from "lucide-react";
import type { Actions, Subjects } from "@/providers/AbilityProvider";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  ability?: {
    action: Actions;
    subject: Subjects;
  };
}
export const navigationItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },

  // Candidate
  {
    label: "My Applications",
    href: "/applications",
    icon: Send,
    ability: { action: "READ", subject: "MyApplication" },
  },
  {
    label: "Applications",
    href: "/applications",
    icon: Send,
    ability: { action: "READ", subject: "Applications" },
  },
  {
    label: "Applay for a job",
    href: "/jobs",
    icon: FilePlus,
    ability: { action: "CREATE", subject: "Application" },
  },
  {
    label: "My Resume",
    href: "/resume",
    icon: FileText,
    ability: { action: "READ", subject: "MyResume" },
  },

  // Recruiter / Org Admin
  {
    label: "Posted Jobs",
    href: "/jobs",
    icon: Briefcase,
    ability: { action: "MANAGE", subject: "OrgJob" },
  },
  {
    label: "Posted Jobs",
    href: "/jobs",
    icon: Briefcase,
    ability: { action: "MANAGE", subject: "Job" },
  },
  {
    label: "Resume Bank",
    href: "/resume-bank",
    icon: FileText,
    ability: { action: "READ", subject: "ResumeBank" },
  },

  // Org Admin
  {
    label: "Team Members",
    href: "/team",
    icon: Users,
    ability: { action: "READ", subject: "Employee" },
  },
  {
    label: "Organization",
    href: "/organization",
    icon: Building2,
    ability: { action: "MANAGE", subject: "Organization" },
  },

  // Super Admin
  {
    label: "All Organizations",
    href: "/admin/orgs",
    icon: Building2,
    ability: { action: "MANAGE", subject: "Organizations" },
  },
  {
    label: "User Management",
    href: "/admin/users",
    icon: Users,
    ability: { action: "MANAGE", subject: "Users" },
  },
  {
    label: "System Settings",
    href: "/admin/settings",
    icon: ShieldCheck,
    ability: { action: "MANAGE", subject: "AppSettings" },
  },

  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
    ability: { action: "READ", subject: "Settings" },
  },
];

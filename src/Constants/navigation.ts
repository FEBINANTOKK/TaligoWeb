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
  UserCircle,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  ability?: {
    action: string;
    subject: string;
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
    label: "Applications",
    href: "/applications",
    icon: Send,
    ability: { action: "VIEW", subject: "Application" },
  },
  {
    label: "My Resume",
    href: "/resume",
    icon: FileText,
    ability: { action: "VIEW", subject: "Resume" },
  },
  {
    label: "Profile",
    href: "/profile",
    icon: UserCircle,
    ability: { action: "UPDATE", subject: "Profile" },
  },

  // Recruiter / Org Admin
  {
    label: "Job Management",
    href: "/jobs",
    icon: Briefcase,
    ability: { action: "MANAGE", subject: "Job" },
  },
  {
    label: "Resume Bank",
    href: "/resume-bank",
    icon: FileText,
    ability: { action: "VIEW", subject: "ResumeBank" },
  },

  // Org Admin
  {
    label: "Team Members",
    href: "/team",
    icon: Users,
    ability: { action: "MANAGE", subject: "User" },
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
    ability: { action: "MANAGE", subject: "Organization" },
  },
  {
    label: "User Management",
    href: "/admin/users",
    icon: Users,
    ability: { action: "MANAGE", subject: "User" },
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
    ability: { action: "VIEW", subject: "Settings" },
  },
];

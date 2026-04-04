import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Send,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const navigationItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Job Management", href: "/jobs", icon: Briefcase },
  { label: "Resume Bank", href: "/resume-bank", icon: FileText },
  { label: "Applications", href: "/applications", icon: Send },
  { label: "Settings", href: "/settings", icon: Settings },
];

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PanelLeftClose, PanelLeftOpen, Plus } from "lucide-react";
import { navigationItems } from "../Constants/navigation";
import { Can } from "@/providers/AbilityProvider";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function Sidebar({
  collapsed,
  onToggle,
  mobileOpen,
  onMobileClose,
}: SidebarProps) {
  const pathname = usePathname();

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo + toggle */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-[var(--sidebar-border)]">
        {!collapsed && (
          <Link
            href="/dashboard"
            className="text-lg font-bold text-[var(--sidebar-foreground)] no-underline truncate"
          >
            Taligo
          </Link>
        )}
        <button
          onClick={onToggle}
          className="hidden lg:flex items-center justify-center w-8 h-8 rounded-md text-[var(--sidebar-foreground)] hover:bg-[var(--sidebar-accent)] transition-colors cursor-pointer"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <PanelLeftOpen className="w-5 h-5" />
          ) : (
            <PanelLeftClose className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav
        className="flex-1 py-4 px-3 space-y-1 overflow-y-auto"
        aria-label="Sidebar navigation"
      >
        {navigationItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          const link = (
            <Link
              key={item.href}
              href={item.href}
              onClick={onMobileClose}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium no-underline transition-colors
                ${collapsed ? "justify-center" : ""}
                ${
                  isActive
                    ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-accent-foreground)]"
                    : "text-[var(--sidebar-foreground)] hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-accent-foreground)]"
                }
              `}
              title={collapsed ? item.label : undefined}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );

          if (!item.ability) {
            return link;
          }

          return (
            <Can
              key={item.href}
              I={item.ability.action}
              a={item.ability.subject}
            >
              {link}
            </Can>
          );
        })}
      </nav>

      {/* Create New Job button */}
      <Can I="MANAGE" a="OrgJob">
        <div className="p-3 border-t border-[var(--sidebar-border)]">
          <Link
            href="/jobs/new"
            onClick={onMobileClose}
            className={`
              flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold no-underline
              bg-[var(--primary)] text-[var(--primary-foreground)]
              hover:opacity-90 transition-opacity
              ${collapsed ? "" : "w-full"}
            `}
          >
            <Plus className="w-5 h-5 shrink-0" />
            {!collapsed && <span>Create New Job</span>}
          </Link>
        </div>
      </Can>
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-[var(--sidebar)] border-r border-[var(--sidebar-border)]
          transform transition-transform duration-300 ease-in-out lg:hidden
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        aria-label="Sidebar"
      >
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={`
          hidden lg:flex flex-col shrink-0 bg-[var(--sidebar)] border-r border-[var(--sidebar-border)]
          transition-[width] duration-300 ease-in-out
          ${collapsed ? "w-[68px]" : "w-64"}
        `}
        aria-label="Sidebar"
      >
        {sidebarContent}
      </aside>
    </>
  );
}

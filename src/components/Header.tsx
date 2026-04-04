"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Bell, Menu, LogOut, User, Moon, Sun } from "lucide-react";
import { useTheme } from "@/providers/ThemeProvider";
import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import TeamSwitcher from "./TeamSwitcher";

interface HeaderProps {
  onMobileMenuToggle: () => void;
}

export default function Header({ onMobileMenuToggle }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { data: session } = useSession();
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut();
    router.push("/sign-in");
  };

  const initials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <header className="sticky top-0 z-30 flex items-center h-16 px-4 gap-4 border-b border-[var(--border)] bg-[var(--card)]">
      {/* Mobile menu button */}
      <button
        onClick={onMobileMenuToggle}
        className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg text-[var(--foreground)] hover:bg-[var(--accent)] transition-colors cursor-pointer"
        aria-label="Toggle sidebar"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
          <input
            type="search"
            placeholder="Search..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-shadow"
            aria-label="Search"
          />
        </div>
      </div>

      {/* Center: Team switcher */}
      <div className="hidden md:flex items-center">
        <TeamSwitcher />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-1 ml-auto">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center w-9 h-9 rounded-lg text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>

        {/* Notifications */}
        <button
          className="relative flex items-center justify-center w-9 h-9 rounded-lg text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--destructive)]" />
        </button>

        {/* Profile dropdown */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-bold cursor-pointer hover:opacity-90 transition-opacity"
            aria-haspopup="menu"
            aria-expanded={profileOpen}
            aria-label="User menu"
          >
            {initials}
          </button>

          {profileOpen && (
            <div
              className="absolute right-0 top-full mt-1 w-56 rounded-lg border border-[var(--border)] bg-[var(--popover)] text-[var(--popover-foreground)] shadow-lg z-50 py-1"
              role="menu"
            >
              {session?.user && (
                <div className="px-3 py-2 border-b border-[var(--border)]">
                  <p className="text-sm font-medium truncate">
                    {session.user.name}
                  </p>
                  <p className="text-xs text-[var(--muted-foreground)] truncate">
                    {session.user.email}
                  </p>
                </div>
              )}
              <button
                role="menuitem"
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[var(--popover-foreground)] hover:bg-[var(--accent)] transition-colors cursor-pointer"
                onClick={() => {
                  setProfileOpen(false);
                  router.push("/settings");
                }}
              >
                <User className="w-4 h-4" />
                Profile
              </button>
              <button
                role="menuitem"
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[var(--destructive)] hover:bg-[var(--accent)] transition-colors cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

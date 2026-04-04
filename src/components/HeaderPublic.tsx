"use client";

import Link from "next/link";
import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTheme } from "@/providers/ThemeProvider";
import TeamSwitcher from "./TeamSwitcher";
import { Moon, Sun } from "lucide-react";

export default function Navbar() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await signOut();
      router.push("/sign-in");
    } catch {
      setLoggingOut(false);
    }
  };

  return (
    <nav className="flex justify-between items-center px-8 py-4 border-b border-border bg-card text-card-foreground">
      <Link href="/" className="font-bold text-xl text-foreground no-underline">
        Taligo
      </Link>
      <div className="flex items-center gap-4">
        {" "}
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
      </div>
    </nav>
  );
}

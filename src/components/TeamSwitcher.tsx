"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronsUpDown, Check } from "lucide-react";

interface Team {
  id: string;
  name: string;
  avatar?: string;
}

const teams: Team[] = [
  { id: "1", name: "Engineering" },
  { id: "2", name: "Design" },
  { id: "3", name: "Marketing" },
];

export default function TeamSwitcher() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Team>(teams[0]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--card)]
          text-sm font-medium text-[var(--foreground)] cursor-pointer
          hover:bg-[var(--accent)] transition-colors
        `}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Switch team"
      >
        <span className="flex items-center justify-center w-6 h-6 rounded-md bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-bold">
          {selected.name.charAt(0)}
        </span>
        <span className="hidden sm:inline truncate max-w-[120px]">
          {selected.name}
        </span>
        <ChevronsUpDown className="w-4 h-4 text-[var(--muted-foreground)] shrink-0" />
      </button>

      {open && (
        <div
          className="absolute top-full mt-1 left-0 w-56 rounded-lg border border-[var(--border)] bg-[var(--popover)] text-[var(--popover-foreground)] shadow-lg z-50 py-1"
          role="listbox"
          aria-label="Teams"
        >
          {teams.map((team) => (
            <button
              key={team.id}
              role="option"
              aria-selected={team.id === selected.id}
              className={`
                flex items-center gap-3 w-full px-3 py-2 text-sm cursor-pointer transition-colors
                ${
                  team.id === selected.id
                    ? "bg-[var(--accent)] text-[var(--accent-foreground)]"
                    : "text-[var(--popover-foreground)] hover:bg-[var(--accent)]"
                }
              `}
              onClick={() => {
                setSelected(team);
                setOpen(false);
              }}
            >
              <span className="flex items-center justify-center w-6 h-6 rounded-md bg-[var(--muted)] text-[var(--muted-foreground)] text-xs font-bold">
                {team.name.charAt(0)}
              </span>
              <span className="truncate">{team.name}</span>
              {team.id === selected.id && (
                <Check className="w-4 h-4 ml-auto shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

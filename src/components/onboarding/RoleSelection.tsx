interface RoleSelectionProps {
  onFindJobs: () => void;
  onHireTalent: () => void;
  isLoading: boolean;
}

export default function RoleSelection({
  onFindJobs,
  onHireTalent,
  isLoading,
}: RoleSelectionProps) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-card-foreground text-center">
        What do you want to do?
      </h1>
      <p className="text-sm text-muted-foreground text-center">
        Choose your path to personalize your workspace.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <button
          type="button"
          onClick={onFindJobs}
          disabled={isLoading}
          className="rounded-lg border border-border bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Please wait..." : "Find Jobs"}
        </button>

        <button
          type="button"
          onClick={onHireTalent}
          disabled={isLoading}
          className="rounded-lg border border-border bg-card px-4 py-3 text-sm font-semibold text-card-foreground transition-colors hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Hire Talent
        </button>
      </div>
    </div>
  );
}

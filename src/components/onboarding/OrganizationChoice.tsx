interface OrganizationChoiceProps {
  onCreate: () => void;
  onJoin: () => void;
  onBack: () => void;
  isLoading: boolean;
}

export default function OrganizationChoice({
  onCreate,
  onJoin,
  onBack,
  isLoading,
}: OrganizationChoiceProps) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-card-foreground text-center">
        Do you have an organization?
      </h1>
      <p className="text-sm text-muted-foreground text-center">
        Create a new workspace or join an existing team.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <button
          type="button"
          onClick={onCreate}
          disabled={isLoading}
          className="rounded-lg border border-border bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Create Organization
        </button>
        <button
          type="button"
          onClick={onJoin}
          disabled={isLoading}
          className="rounded-lg border border-border bg-card px-4 py-3 text-sm font-semibold text-card-foreground transition-colors hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Join Organization
        </button>
      </div>

      <button
        type="button"
        onClick={onBack}
        disabled={isLoading}
        className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Back
      </button>
    </div>
  );
}
